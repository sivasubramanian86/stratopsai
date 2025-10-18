#!/bin/bash

# Upload dummy models script for StratOpsAI
set -e

echo "🚀 Uploading dummy models to S3..."

# Get bucket name from CloudFormation stack
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name stratopsai-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`ArtifactsBucketName`].OutputValue' \
  --output text)

if [ -z "$BUCKET_NAME" ]; then
  echo "❌ Error: Could not find artifacts bucket name"
  exit 1
fi

echo "📦 Using bucket: $BUCKET_NAME"

# Create temporary directory for models
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Create dummy models
for model in sla-breach-risk churn-propensity uplift-predictor; do
  echo "📝 Creating dummy model: $model"
  
  mkdir -p "$model"
  cat > "$model/model.py" << EOF
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Dummy model for $model
model = RandomForestClassifier(n_estimators=10, random_state=42)
X_dummy = np.random.rand(100, 5)
y_dummy = np.random.randint(0, 2, 100)
model.fit(X_dummy, y_dummy)

# Save model
joblib.dump(model, 'model.pkl')
EOF

  cat > "$model/inference.py" << EOF
import joblib
import json
import numpy as np

def model_fn(model_dir):
    return joblib.load(f"{model_dir}/model.pkl")

def input_fn(request_body, request_content_type):
    if request_content_type == 'application/json':
        data = json.loads(request_body)
        return np.array(data['instances'])
    raise ValueError(f"Unsupported content type: {request_content_type}")

def predict_fn(input_data, model):
    predictions = model.predict_proba(input_data)
    return predictions.tolist()

def output_fn(prediction, content_type):
    if content_type == 'application/json':
        return json.dumps({'predictions': prediction})
    raise ValueError(f"Unsupported content type: {content_type}")
EOF

  # Create model.tar.gz
  cd "$model"
  python3 -c "
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=10, random_state=42)
X_dummy = np.random.rand(100, 5)
y_dummy = np.random.randint(0, 2, 100)
model.fit(X_dummy, y_dummy)
joblib.dump(model, 'model.pkl')
"
  
  tar -czf model.tar.gz model.pkl inference.py
  cd ..
  
  # Upload to S3
  echo "⬆️  Uploading $model to S3..."
  aws s3 cp "$model/model.tar.gz" "s3://$BUCKET_NAME/models/$model/model.tar.gz"
done

# Cleanup
cd /
rm -rf "$TEMP_DIR"

echo "✅ All dummy models uploaded successfully!"
echo "📍 Models available at: s3://$BUCKET_NAME/models/"