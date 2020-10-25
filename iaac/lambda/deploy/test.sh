#!/bin/bash

echo "start -> "

LAMBDA_PUBLISHED=$(aws lambda publish-version --function-name lambda_edge_cloudfront_hecate_redirect_preprod --region us-east-1 --output=json| jq '.')
echo '---- LAMBDA_PUBLISHED'
echo $LAMBDA_PUBLISHED
ARN_LAMBDA_PUBLISHED=$(echo ${LAMBDA_PUBLISHED} | python -c "import sys, json; print(json.load(sys.stdin)['FunctionArn'])")
echo '---- LAMBDA ARN ----'
echo $ARN_LAMBDA_PUBLISHED
CF_ORIGINAL_CONFIG=$(aws cloudfront get-distribution-config --id E2G3KTI1CTRBWY --output=json| jq '.')
echo '---- CF_ORIGINAL_CONFIG'
echo $CF_ORIGINAL_CONFIG
CF_ETAG=$(echo ${CF_ORIGINAL_CONFIG} | python -c "import sys, json; print(json.load(sys.stdin)['ETag'])")
echo '---- CF_ETAG'
echo $CF_ETAG
echo $(echo ${CF_ORIGINAL_CONFIG} | python /Users/damien/Sites/hermes/Hecate/hecate/iaac/lambda/deploy/update_cloudfront_config_for_redirect.py ${ARN_LAMBDA_PUBLISHED} ) > /Users/damien/Sites/hermes/Hecate/hecate/iaac/lambda/deploy/cf_config.update.json