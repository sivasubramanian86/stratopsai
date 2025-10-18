# StratOpsAI API Documentation

## Base URL

```
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}
```

Where:
- `{api-id}`: API Gateway ID (auto-generated)
- `{region}`: AWS region (default: us-east-1)  
- `{stage}`: Environment stage (dev/prod)

## Authentication

Currently no authentication required for hackathon demo. Production deployment should implement:
- API Keys
- AWS IAM authentication
- Cognito User Pools

## Endpoints

### POST /ai/reasoning

Analyzes customer data and provides AI-powered strategic insights.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "customer_id": "string (required)",
  "metrics": {
    "sla_score": "number (0.0-1.0, optional, default: 0.5)",
    "usage_trend": "number (-1.0 to 1.0, optional, default: 0.0)", 
    "support_tickets": "integer (optional, default: 0)",
    "contract_value": "number (optional, default: 1000)",
    "tenure_months": "integer (optional, default: 12)"
  }
}
```

**Field Descriptions:**
- `customer_id`: Unique customer identifier
- `sla_score`: Current SLA performance score (1.0 = perfect)
- `usage_trend`: Usage change trend (-1.0 = declining, +1.0 = growing)
- `support_tickets`: Number of recent support tickets
- `contract_value`: Annual contract value in USD
- `tenure_months`: Customer tenure in months

#### Response

**Success (200):**
```json
{
  "customer_id": "CUST-12345",
  "predictions": {
    "sla_breach_risk": {
      "probability": 0.75,
      "confidence": "high"
    },
    "churn_propensity": {
      "probability": 0.45,
      "confidence": "medium"
    },
    "uplift_potential": {
      "probability": 0.65,
      "confidence": "high"
    }
  },
  "narrative": "Customer CUST-12345 shows HIGH SLA breach risk (75% probability) requiring immediate attention. Churn risk is moderate (45%) but manageable with proactive engagement. Strong upsell opportunity identified (65% uplift potential). Recommended actions: 1) Immediate SLA remediation, 2) Account manager engagement, 3) Explore expansion opportunities. Priority: HIGH",
  "timestamp": "aws-request-id-12345"
}
```

**Error (400) - Missing customer_id:**
```json
{
  "error": "customer_id is required"
}
```

**Error (500) - Internal server error:**
```json
{
  "error": "Internal server error"
}
```

## Sample Requests

### High-Risk Customer
```bash
curl -X POST "https://abc123.execute-api.us-east-1.amazonaws.com/dev/ai/reasoning" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST-HIGH-RISK",
    "metrics": {
      "sla_score": 0.45,
      "usage_trend": -0.3,
      "support_tickets": 8,
      "contract_value": 100000,
      "tenure_months": 36
    }
  }'
```

### Stable Customer
```bash
curl -X POST "https://abc123.execute-api.us-east-1.amazonaws.com/dev/ai/reasoning" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST-STABLE",
    "metrics": {
      "sla_score": 0.92,
      "usage_trend": 0.1,
      "support_tickets": 1,
      "contract_value": 50000,
      "tenure_months": 18
    }
  }'
```

### Growth Opportunity
```bash
curl -X POST "https://abc123.execute-api.us-east-1.amazonaws.com/dev/ai/reasoning" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST-GROWTH",
    "metrics": {
      "sla_score": 0.88,
      "usage_trend": 0.4,
      "support_tickets": 0,
      "contract_value": 25000,
      "tenure_months": 12
    }
  }'
```

## Response Interpretation

### Prediction Probabilities
- **0.0 - 0.3**: Low risk/potential
- **0.3 - 0.7**: Medium risk/potential  
- **0.7 - 1.0**: High risk/potential

### Confidence Levels
- **low**: Model uncertainty is high, use with caution
- **medium**: Reasonable confidence in prediction
- **high**: High confidence, suitable for automated actions

### Priority Mapping
- **HIGH**: Any prediction > 0.7 requires immediate attention
- **MEDIUM**: Predictions 0.5-0.7 need monitoring and proactive measures
- **LOW**: Predictions < 0.5 are stable, routine management sufficient

## Error Handling

The API implements graceful degradation:
- If individual SageMaker endpoints fail, partial results are returned
- If Bedrock is unavailable, fallback narrative generation is used
- All errors are logged for debugging while returning user-friendly messages

## Rate Limits

Current implementation has no rate limits. Production deployment should implement:
- API Gateway throttling
- Lambda concurrency limits
- SageMaker endpoint scaling policies

## Monitoring

Key metrics to monitor:
- API Gateway request count and latency
- Lambda function duration and errors
- SageMaker endpoint invocation count and latency
- Bedrock model invocation count and token usage