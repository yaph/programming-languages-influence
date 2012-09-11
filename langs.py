# -*- coding: utf-8 -*-
# Get programming languages data from freebase and save in json format 
# appropriate for generating a network graph with sigma.js.
import requests, requests_cache, json

requests_cache.configure('freebase')
langs = []
paradigms = {}

with open('query.json') as f:
    query = f.read()

r = requests.get('https://www.googleapis.com/freebase/v1/mqlread', params={'query': query})
res = json.loads(r.text)['result']
for index, lang in enumerate(res):

    paras = []
    for i in lang['language_paradigms']:
        pid = i['id']
        name = i['name']
        paras.append({'id': pid, 'name': name})
        if pid not in paradigms:
            paradigms[pid] = {'count': 1, 'name': name, 'id': pid}
        else:
            paradigms[pid]['count'] += 1

    langs.append({
        'index': index,
        'size': len(lang['influenced']),
        'influenced': [{'id': i['id'], 'name': i['name']} for i in lang['influenced']],
        'paradigms': paras,
        'id': lang['id'],
        'label': lang['name']
    })

data = {
    'paradigms': [i[1] for i in sorted(paradigms.items(), key=lambda x: x[1]['count'], reverse=True)],
    'langs': langs
}

with open('data.json', 'w') as f:
    json.dump(data, f)
