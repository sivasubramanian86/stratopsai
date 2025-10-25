#!/bin/bash

# Cleanup S3 buckets for StratOpsAI
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
STACK_NAME="stratopsai-infrastructure"

echo "🧹 Cleaning up S3 buckets for stack: $STACK_NAME"

# Get bucket names from stack outputs
ARTIFACTS_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`ArtifactsBucketName`].OutputValue' \
  --output text 2>/dev/null || echo "")

RAW_DATA_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`RawDataBucketName`].OutputValue' \
  --output text 2>/dev/null || echo "")

cleanup_bucket() {
  local bucket_name="$1"
  if [[ -n "$bucket_name" && "$bucket_name" != "None" ]]; then
    echo "🗑️  Cleaning bucket: $bucket_name"
    
    # Delete all objects
    aws s3 rm "s3://$bucket_name" --recursive --region "$AWS_REGION" 2>/dev/null || true
    
    # Delete all object versions
    aws s3api list-object-versions --bucket "$bucket_name" --region "$AWS_REGION" --query 'Versions[].{Key:Key,VersionId:VersionId}' --output json 2>/dev/null | \
    jq -r '.[] | "\(.Key) \(.VersionId)"' | \
    while read -r key version_id; do
      if [[ -n "$key" && -n "$version_id" ]]; then
        aws s3api delete-object --bucket "$bucket_name" --key "$key" --version-id "$version_id" --region "$AWS_REGION" 2>/dev/null || true
      fi
    done
    
    # Delete all delete markers
    aws s3api list-object-versions --bucket "$bucket_name" --region "$AWS_REGION" --query 'DeleteMarkers[].{Key:Key,VersionId:VersionId}' --output json 2>/dev/null | \
    jq -r '.[] | "\(.Key) \(.VersionId)"' | \
    while read -r key version_id; do
      if [[ -n "$key" && -n "$version_id" ]]; then
        aws s3api delete-object --bucket "$bucket_name" --key "$key" --version-id "$version_id" --region "$AWS_REGION" 2>/dev/null || true
      fi
    done
    
    echo "✅ Bucket $bucket_name cleaned"
  fi
}

cleanup_bucket "$ARTIFACTS_BUCKET"
cleanup_bucket "$RAW_DATA_BUCKET"

echo "✅ All buckets cleaned successfully"