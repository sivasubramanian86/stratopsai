import json
import boto3
import logging
import os
from typing import Dict, Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
sagemaker_runtime = boto3.client('sagemaker-runtime')
bedrock_runtime = boto3.client('bedrock-runtime')

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AI Reasoning Lambda handler that invokes SageMaker endpoints and Bedrock
    """
    try:
        # Parse request body
        if 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        customer_id = body.get('customer_id')
        metrics = body.get('metrics', {})
        
        if not customer_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'customer_id is required'})
            }
        
        logger.info(f"Processing request for customer: {customer_id}")
        
        # Prepare input data for SageMaker models
        input_data = [
            metrics.get('sla_score', 0.5),
            metrics.get('usage_trend', 0.0),
            metrics.get('support_tickets', 0),
            metrics.get('contract_value', 1000),
            metrics.get('tenure_months', 12)
        ]
        
        # Get predictions from SageMaker endpoints
        predictions = {}
        
        # SLA Breach Risk
        try:
            sla_prediction = invoke_sagemaker_endpoint(
                os.environ['SLA_BREACH_ENDPOINT'],
                input_data
            )
            predictions['sla_breach_risk'] = sla_prediction
        except Exception as e:
            logger.error(f"SLA breach prediction failed: {e}")
            predictions['sla_breach_risk'] = {'error': str(e)}
        
        # Churn Propensity
        try:
            churn_prediction = invoke_sagemaker_endpoint(
                os.environ['CHURN_PROPENSITY_ENDPOINT'],
                input_data
            )
            predictions['churn_propensity'] = churn_prediction
        except Exception as e:
            logger.error(f"Churn prediction failed: {e}")
            predictions['churn_propensity'] = {'error': str(e)}
        
        # Uplift Predictor
        try:
            uplift_prediction = invoke_sagemaker_endpoint(
                os.environ['UPLIFT_PREDICTOR_ENDPOINT'],
                input_data
            )
            predictions['uplift_potential'] = uplift_prediction
        except Exception as e:
            logger.error(f"Uplift prediction failed: {e}")
            predictions['uplift_potential'] = {'error': str(e)}
        
        # Generate narrative using Bedrock Claude
        narrative = generate_narrative(customer_id, metrics, predictions)
        
        response = {
            'customer_id': customer_id,
            'predictions': predictions,
            'narrative': narrative,
            'timestamp': context.aws_request_id
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(response)
        }
        
    except Exception as e:
        logger.error(f"Lambda execution failed: {e}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Internal server error'})
        }

def invoke_sagemaker_endpoint(endpoint_name: str, input_data: list) -> Dict[str, Any]:
    """Invoke SageMaker endpoint with input data"""
    payload = {
        'instances': [input_data]
    }
    
    response = sagemaker_runtime.invoke_endpoint(
        EndpointName=endpoint_name,
        ContentType='application/json',
        Body=json.dumps(payload)
    )
    
    result = json.loads(response['Body'].read().decode())
    
    # Extract probability scores
    if 'predictions' in result and len(result['predictions']) > 0:
        prediction = result['predictions'][0]
        if isinstance(prediction, list) and len(prediction) >= 2:
            return {
                'probability': float(prediction[1]),  # Probability of positive class
                'confidence': 'high' if abs(prediction[1] - 0.5) > 0.3 else 'medium'
            }
    
    return {'probability': 0.5, 'confidence': 'low'}

def generate_narrative(customer_id: str, metrics: Dict[str, Any], predictions: Dict[str, Any]) -> str:
    """Generate narrative using Bedrock Claude"""
    try:
        # Prepare prompt for Claude
        prompt = f"""
        Analyze the following customer data and AI predictions to provide strategic insights:

        Customer ID: {customer_id}
        Metrics: {json.dumps(metrics, indent=2)}
        AI Predictions: {json.dumps(predictions, indent=2)}

        Provide a concise strategic analysis covering:
        1. Key risk factors
        2. Recommended actions
        3. Priority level

        Keep the response under 200 words and focus on actionable insights.
        """
        
        # Invoke Bedrock Claude
        response = bedrock_runtime.invoke_model(
            modelId=os.environ['BEDROCK_MODEL_ID'],
            body=json.dumps({
                'anthropic_version': 'bedrock-2023-05-31',
                'max_tokens': 300,
                'messages': [
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ]
            })
        )
        
        result = json.loads(response['body'].read())
        return result['content'][0]['text']
        
    except Exception as e:
        logger.error(f"Bedrock narrative generation failed: {e}")
        return generate_fallback_narrative(customer_id, metrics, predictions)

def generate_fallback_narrative(customer_id: str, metrics: Dict[str, Any], predictions: Dict[str, Any]) -> str:
    """Generate fallback narrative when Bedrock is unavailable"""
    sla_risk = predictions.get('sla_breach_risk', {}).get('probability', 0.5)
    churn_risk = predictions.get('churn_propensity', {}).get('probability', 0.5)
    uplift_potential = predictions.get('uplift_potential', {}).get('probability', 0.5)
    
    narrative = f"Customer {customer_id} analysis: "
    
    if sla_risk > 0.7:
        narrative += "HIGH SLA breach risk detected. Immediate attention required. "
    elif sla_risk > 0.5:
        narrative += "Moderate SLA risk. Monitor closely. "
    
    if churn_risk > 0.7:
        narrative += "HIGH churn probability. Implement retention strategy. "
    elif churn_risk > 0.5:
        narrative += "Elevated churn risk. Consider proactive engagement. "
    
    if uplift_potential > 0.6:
        narrative += "Strong upsell opportunity identified. "
    
    narrative += f"Priority: {'HIGH' if max(sla_risk, churn_risk) > 0.7 else 'MEDIUM' if max(sla_risk, churn_risk) > 0.5 else 'LOW'}"
    
    return narrative