#!/bin/bash

# Force cleanup S3 buckets and skip failed resources
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
STACK_NAME="stratopsai-infrastructure"

echo "🚨 Force cleaning S3 buckets and skipping failed resources"

# Get actual bucket names (not from stack outputs since they may be unavailable)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ARTIFACTS_BUCKET="StratOpsAI-artifacts-dev-${ACCOUNT_ID}"
RAW_DATA_BUCKET="StratOpsAI-rawdata-dev-${ACCOUNT_ID}"

force_empty_bucket() {
  local bucket_name="$1"
  echo "🗑️  Force emptying bucket: $bucket_name"
  
  # Check if bucket exists
  if aws s3api head-bucket --bucket "$bucket_name" --region "$AWS_REGION" 2>/dev/null; then
    # Remove all objects and versions
    aws s3api list-object-versions --bucket "$bucket_name" --region "$AWS_REGION" --output json 2>/dev/null | \
    jq -r '.Versions[]?, .DeleteMarkers[]? | select(. != null) | "\(.Key)\t\(.VersionId)"' | \
    while IFS=$'\t' read -r key version_id; do
      if [[ -n "$key" && -n "$version_id" ]]; then
        aws s3api delete-object --bucket "$bucket_name" --key "$key" --version-id "$version_id" --region "$AWS_REGION" 2>/dev/null || true
      fi
    done
    
    # Final cleanup
    aws s3 rm "s3://$bucket_name" --recursive --region "$AWS_REGION" 2>/dev/null || true
    echo "✅ Bucket $bucket_name emptied"
  else
    echo "⚠️  Bucket $bucket_name does not exist"
  fi
}

force_empty_bucket "$ARTIFACTS_BUCKET"
force_empty_bucket "$RAW_DATA_BUCKET"

# Continue stack deletion with retain policy for failed resources
echo "🔄 Continuing stack deletion with retain policy..."
aws cloudformation continue-update-rollback \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --resources-to-skip ArtifactsBucket RawDataBucket 2>/dev/null || true

echo "✅ Force cleanup completed. Retry stack deletion now."