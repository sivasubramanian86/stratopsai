import pytest
import json
import boto3
from moto import mock_sagemaker, mock_bedrock
from unittest.mock import patch, MagicMock
import sys
import os

# Add lambda directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'ai_reasoning'))

import index

@pytest.fixture
def lambda_context():
    """Mock Lambda context"""
    context = MagicMock()
    context.aws_request_id = 'test-request-id'
    context.function_name = 'test-function'
    return context

@pytest.fixture
def sample_event():
    """Sample Lambda event"""
    return {
        'body': json.dumps({
            'customer_id': 'CUST-12345',
            'metrics': {
                'sla_score': 0.85,
                'usage_trend': -0.1,
                'support_tickets': 3,
                'contract_value': 50000,
                'tenure_months': 24
            }
        })
    }

@pytest.fixture
def direct_event():
    """Direct event (not from API Gateway)"""
    return {
        'customer_id': 'CUST-67890',
        'metrics': {
            'sla_score': 0.65,
            'usage_trend': 0.2,
            'support_tickets': 1,
            'contract_value': 25000,
            'tenure_months': 6
        }
    }

@patch.dict(os.environ, {
    'SLA_BREACH_ENDPOINT': 'sla-breach-risk-dev',
    'CHURN_PROPENSITY_ENDPOINT': 'churn-propensity-dev',
    'UPLIFT_PREDICTOR_ENDPOINT': 'uplift-predictor-dev',
    'BEDROCK_MODEL_ID': 'anthropic.claude-3-sonnet-20240229-v1:0'
})
class TestAIReasoning:
    
    def test_lambda_handler_success(self, sample_event, lambda_context):
        """Test successful Lambda execution"""
        with patch('index.invoke_sagemaker_endpoint') as mock_sagemaker, \
             patch('index.generate_narrative') as mock_narrative:
            
            # Mock SageMaker responses
            mock_sagemaker.side_effect = [
                {'probability': 0.75, 'confidence': 'high'},  # SLA breach
                {'probability': 0.45, 'confidence': 'medium'},  # Churn
                {'probability': 0.65, 'confidence': 'high'}   # Uplift
            ]
            
            # Mock narrative
            mock_narrative.return_value = "Customer shows high SLA risk but low churn probability."
            
            response = index.lambda_handler(sample_event, lambda_context)
            
            assert response['statusCode'] == 200
            body = json.loads(response['body'])
            assert body['customer_id'] == 'CUST-12345'
            assert 'predictions' in body
            assert 'narrative' in body
            assert body['predictions']['sla_breach_risk']['probability'] == 0.75

    def test_lambda_handler_direct_event(self, direct_event, lambda_context):
        """Test Lambda with direct event (not API Gateway)"""
        with patch('index.invoke_sagemaker_endpoint') as mock_sagemaker, \
             patch('index.generate_narrative') as mock_narrative:
            
            mock_sagemaker.return_value = {'probability': 0.5, 'confidence': 'medium'}
            mock_narrative.return_value = "Standard risk profile."
            
            response = index.lambda_handler(direct_event, lambda_context)
            
            assert response['statusCode'] == 200
            body = json.loads(response['body'])
            assert body['customer_id'] == 'CUST-67890'

    def test_lambda_handler_missing_customer_id(self, lambda_context):
        """Test Lambda with missing customer_id"""
        event = {'body': json.dumps({'metrics': {}})}
        
        response = index.lambda_handler(event, lambda_context)
        
        assert response['statusCode'] == 400
        body = json.loads(response['body'])
        assert 'error' in body

    def test_invoke_sagemaker_endpoint_success(self):
        """Test SageMaker endpoint invocation"""
        with patch('index.sagemaker_runtime') as mock_client:
            # Mock SageMaker response
            mock_response = {
                'Body': MagicMock()
            }
            mock_response['Body'].read.return_value.decode.return_value = json.dumps({
                'predictions': [[0.3, 0.7]]
            })
            mock_client.invoke_endpoint.return_value = mock_response
            
            result = index.invoke_sagemaker_endpoint('test-endpoint', [0.5, 0.1, 2, 1000, 12])
            
            assert result['probability'] == 0.7
            assert result['confidence'] == 'high'

    def test_invoke_sagemaker_endpoint_failure(self):
        """Test SageMaker endpoint failure handling"""
        with patch('index.sagemaker_runtime') as mock_client:
            mock_client.invoke_endpoint.side_effect = Exception("Endpoint not found")
            
            with pytest.raises(Exception):
                index.invoke_sagemaker_endpoint('invalid-endpoint', [0.5])

    def test_generate_narrative_success(self):
        """Test Bedrock narrative generation"""
        with patch('index.bedrock_runtime') as mock_client:
            # Mock Bedrock response
            mock_response = {
                'body': MagicMock()
            }
            mock_response['body'].read.return_value = json.dumps({
                'content': [{'text': 'Generated narrative from Claude'}]
            })
            mock_client.invoke_model.return_value = mock_response
            
            narrative = index.generate_narrative(
                'CUST-123',
                {'sla_score': 0.8},
                {'sla_breach_risk': {'probability': 0.6}}
            )
            
            assert narrative == 'Generated narrative from Claude'

    def test_generate_narrative_fallback(self):
        """Test fallback narrative generation"""
        with patch('index.bedrock_runtime') as mock_client:
            mock_client.invoke_model.side_effect = Exception("Bedrock unavailable")
            
            narrative = index.generate_narrative(
                'CUST-123',
                {'sla_score': 0.8},
                {
                    'sla_breach_risk': {'probability': 0.8},
                    'churn_propensity': {'probability': 0.3},
                    'uplift_potential': {'probability': 0.7}
                }
            )
            
            assert 'CUST-123' in narrative
            assert 'HIGH SLA breach risk' in narrative
            assert 'Strong upsell opportunity' in narrative
            assert 'Priority: HIGH' in narrative

    def test_generate_fallback_narrative_medium_risk(self):
        """Test fallback narrative for medium risk customer"""
        narrative = index.generate_fallback_narrative(
            'CUST-456',
            {},
            {
                'sla_breach_risk': {'probability': 0.6},
                'churn_propensity': {'probability': 0.55},
                'uplift_potential': {'probability': 0.4}
            }
        )
        
        assert 'CUST-456' in narrative
        assert 'Moderate SLA risk' in narrative
        assert 'Elevated churn risk' in narrative
        assert 'Priority: MEDIUM' in narrative

    def test_lambda_handler_sagemaker_partial_failure(self, sample_event, lambda_context):
        """Test Lambda when some SageMaker endpoints fail"""
        with patch('index.invoke_sagemaker_endpoint') as mock_sagemaker, \
             patch('index.generate_narrative') as mock_narrative:
            
            # First call succeeds, second fails, third succeeds
            mock_sagemaker.side_effect = [
                {'probability': 0.75, 'confidence': 'high'},
                Exception("Endpoint unavailable"),
                {'probability': 0.65, 'confidence': 'high'}
            ]
            
            mock_narrative.return_value = "Partial analysis available."
            
            response = index.lambda_handler(sample_event, lambda_context)
            
            assert response['statusCode'] == 200
            body = json.loads(response['body'])
            assert body['predictions']['sla_breach_risk']['probability'] == 0.75
            assert 'error' in body['predictions']['churn_propensity']
            assert body['predictions']['uplift_potential']['probability'] == 0.65

if __name__ == '__main__':
    pytest.main([__file__])