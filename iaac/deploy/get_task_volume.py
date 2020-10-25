import sys, json, argparse

volume = json.load(sys.stdin)['taskDefinition']['volumes']
print json.dumps(volume)