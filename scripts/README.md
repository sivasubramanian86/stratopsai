# StratOpsAI Deployment Scripts

## Quick Start

```bash
# Make scripts executable (Linux/Mac/WSL)
chmod +x scripts/*.sh

# Deploy infrastructure
./scripts/deploy_stack1.sh

# Upload model artifacts
./scripts/upload_dummy_models.sh

# Deploy AI core (mock mode - no charges)
./scripts/deploy_stack2.sh

# Deploy AI core (real mode - charges apply)
./scripts/deploy_stack2.sh --enable-endpoints=true
```

## Script Details

### deploy_stack1.sh
Deploys base infrastructure (S3, IAM, API Gateway, Kinesis).

**Usage:**
```bash
./scripts/deploy_stack1.sh [OPTIONS]

Options:
  --project-name=NAME     Project name (default: StratOpsAI)
  --environment=ENV       Environment (default: dev)
  --log-retention=DAYS    Log retention days (default: 7)
  --help                  Show help
```

**Examples:**
```bash
# Default deployment
./scripts/deploy_stack1.sh

# Custom environment
./scripts/deploy_stack1.sh --environment=prod --log-retention=30

# Custom project
./scripts/deploy_stack1.sh --project-name=MyAI --environment=staging
```

### deploy_stack2.sh
Deploys AI core (SageMaker models, Lambda, API methods).

**Usage:**
```bash
./scripts/deploy_stack2.sh [OPTIONS]

Options:
  --enable-endpoints=BOOL Enable SageMaker endpoints (default: false)
  --log-retention=DAYS    Log retention days (default: 7)
  --project-name=NAME     Project name (default: StratOpsAI)
  --environment=ENV       Environment (default: dev)
  --help                  Show help
```

**Examples:**
```bash
# Mock mode (no charges)
./scripts/deploy_stack2.sh

# Real mode (charges apply)
./scripts/deploy_stack2.sh --enable-endpoints=true

# Custom settings
./scripts/deploy_stack2.sh --enable-endpoints=false --log-retention=14
```

## Cost Control

### Free Tier Mode (Default)
- `--enable-endpoints=false`
- Lambda mock predictions
- No SageMaker endpoint charges
- **Monthly cost: ~$0.36** (Kinesis only)

### Production Mode
- `--enable-endpoints=true`
- Real SageMaker inference
- 3 × ml.t2.medium endpoints
- **Monthly cost: ~$195** (plus usage)

## Validation Features

Both scripts include comprehensive validation:
- ✅ AWS CLI and credentials check
- ✅ Template file existence
- ✅ Parameter validation
- ✅ Stack dependency verification
- ✅ API endpoint testing
- ✅ Cost warnings and summaries

## Error Handling

Scripts use `set -euo pipefail` for strict error handling:
- Exit on any command failure
- Exit on undefined variables
- Exit on pipe failures
- Comprehensive error messages

## Environment Variables

- `AWS_REGION`: Override default region (us-east-1)
- `AWS_PROFILE`: Use specific AWS profile

```bash
# Use different region
AWS_REGION=us-west-2 ./scripts/deploy_stack1.sh

# Use specific profile
AWS_PROFILE=hackathon ./scripts/deploy_stack2.sh
```