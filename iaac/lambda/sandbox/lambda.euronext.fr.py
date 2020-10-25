import json
import urllib3

def lambda_handler(event, context):
    print event.credentials
    url = "https://src.tools.hermes.com/projects/HECBO/repos/mock-api/raw/api/scheduled/nothing.json?at=refs%2Fheads%2Fmaster"
    http = urllib3.PoolManager()
    r = http.request('GET', url)

    return r.data
