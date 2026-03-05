import requests

try:
    res = requests.get('http://localhost:3001/api/settings/site')
    print(res.status_code, res.json())
except Exception as e:
    print(e)
