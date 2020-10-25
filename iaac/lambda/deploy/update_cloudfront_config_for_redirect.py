import sys, json, argparse

parser = argparse.ArgumentParser('Replaces lambda@edge redirect version')
parser.add_argument('lambda_config', metavar='I', type=str, nargs='+',
                   help='Lambda configuration')

args = parser.parse_args()

definition = json.load(sys.stdin)
lambdaFunctionAssociation = definition['DistributionConfig']['DefaultCacheBehavior']['LambdaFunctionAssociations']['Items']

i = 0
while i < len(lambdaFunctionAssociation):
 if lambdaFunctionAssociation[i]['EventType'] == 'viewer-request':
    definition['DistributionConfig']['DefaultCacheBehavior']['LambdaFunctionAssociations']['Items'][i]['LambdaFunctionARN'] = args.lambda_config[0]
 i = i + 1

print json.dumps(definition['DistributionConfig'])
