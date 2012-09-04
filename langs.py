# -*- coding: utf-8 -*-
import requests, requests_cache, json

requests_cache.configure('freebase')

with open('query.json') as f:
    query = f.read()

with open('langs.json', 'w') as f:
    r = requests.get('https://www.googleapis.com/freebase/v1/mqlread', params={'query': query})
    f.write(r.text)
