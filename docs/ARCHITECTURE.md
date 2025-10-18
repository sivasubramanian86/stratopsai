# StratOpsAI Architecture

## Overview

StratOpsAI uses a modular two-stack CloudFormation architecture to separate infrastructure concerns from AI-specific resources, enabling independent deployment and scaling.

## Stack Architecture

### Stack 1: Infrastructure Foundation (`stratopsai-infrastructure`)

**Purpose**: Provisions shared infrastructure resources that support the AI core components.

**Resources**:
- **S3 Buckets**:
  - `ArtifactsBucket`: Stores ML models, Lambda code, and deployment artifacts
  - `RawDataBucket`: Stores raw customer data for processing
- **VPC & Networking**:
  - Private subnets for SageMaker endpoints
  - Security groups with minimal required access
- **IAM Roles**:
  - `SageMakerExecutionRole`: Allows SageMaker to access S3 and invoke models
  - `LambdaExecutionRole`: Allows Lambda to invoke SageMaker and Bedrock
- **API Gateway**: Base REST API for external integrations
- **Kinesis Stream**: Real-time data ingestion pipeline

**Outputs**: Exports resource ARNs and IDs for Stack 2 consumption via CloudFormation exports.

### Stack 2: AI Core (`stratopsai-ai-core`)

**Purpose**: Provisions AI-specific resources that depend on Stack 1 infrastructure.

**Resources**:
- **SageMaker Models**:
  - `sla-breach-risk`: Predicts SLA violation probability
  - `churn-propensity`: Estimates customer churn likelihood  
  - `uplift-predictor`: Identifies upsell/cross-sell opportunities
- **SageMaker Endpoints**: Real-time inference endpoints for each model
- **Lambda Function**: `AIReasoningFunction` orchestrates predictions and generates narratives
- **API Gateway Integration**: `/ai/reasoning` endpoint connected to Lambda

**Dependencies**: Uses `!ImportValue` to reference Stack 1 exports for IAM roles, S3 buckets, and API Gateway.

## Data Flow

```
Client Request → API Gateway → Lambda Function → SageMaker Endpoints
                                     ↓
                              Bedrock Claude → Narrative Generation
                                     ↓
                              Response with Predictions + Insights
```

## Parameter Synchronization

### Stack 1 → Stack 2 Communication

Stack 2 automatically discovers Stack 1 resources using CloudFormation exports:

```yaml
# Stack 1 exports
Outputs:
  ArtifactsBucketName:
    Export:
      Name: !Sub '${AWS::StackName}-ArtifactsBucket'

# Stack 2 imports  
Properties:
  ModelDataUrl: !Sub 
    - 's3://${BucketName}/models/sla-breach-risk/model.tar.gz'
    - BucketName: !ImportValue 
        Fn::Sub: '${InfraStackName}-ArtifactsBucket'
```

### Dynamic Parameter Discovery

Deployment scripts use AWS CLI to discover resource names:

```bash
# Auto-discover bucket name
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name stratopsai-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`ArtifactsBucketName`].OutputValue' \
  --output text)
```

## Environment Separation

Both stacks support environment-specific deployments:

- **Development**: `stratopsai-infrastructure-dev` + `stratopsai-ai-core-dev`
- **Production**: `stratopsai-infrastructure-prod` + `stratopsai-ai-core-prod`

Environment parameter controls:
- Resource naming conventions
- Instance types and scaling
- Monitoring and logging levels

## Security Model

### Network Security
- SageMaker endpoints deployed in private subnets
- Security groups restrict access to necessary ports only
- No public internet access for ML inference

### IAM Security
- Principle of least privilege for all roles
- Cross-service access limited to specific resources
- No wildcard permissions in production

### Data Security
- S3 buckets with versioning and encryption
- VPC endpoints for secure AWS service communication
- CloudTrail logging for audit compliance

## Scalability Considerations

### Horizontal Scaling
- SageMaker endpoints support auto-scaling based on traffic
- Lambda functions scale automatically with concurrent requests
- Kinesis streams can be resharded for higher throughput

### Vertical Scaling
- Instance types configurable per environment
- Memory and timeout settings adjustable via parameters
- Multi-AZ deployment for high availability

## Cost Optimization

### Development Environment
- Smaller instance types (`ml.t2.medium`)
- Single instance deployments
- Reduced monitoring and logging

### Production Environment  
- Right-sized instances based on load testing
- Auto-scaling to handle traffic spikes
- Enhanced monitoring for cost tracking

## Deployment Dependencies

1. **Stack 1** must be deployed first (provides foundation)
2. **Model artifacts** must be uploaded to S3 before Stack 2 deployment
3. **Stack 2** deployment validates Stack 1 existence and imports required resources
4. **API testing** can only occur after both stacks are successfully deployed

This modular approach enables:
- Independent infrastructure updates without affecting AI models
- Environment-specific configurations
- Simplified troubleshooting and maintenance
- Cost-effective resource management