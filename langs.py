# -*- coding: utf-8 -*-
# Get programming languages data from freebase and save in json format 
# appropriate for generating a network graph with sigma.js.
import requests, requests_cache, json
import networkx as nx

requests_cache.configure('freebase')
langs = []
paradigms = {}
plin = 'Programming Languages Influence Network'
graph_file = 'plin.gexf'

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
        'influenced': [{'id': i['id'], 'name': i['name']} for i in sorted(lang['influenced'], key=lambda x: x['name'])],
        'influencedby': [{'id': i['id'], 'name': i['name']} for i in sorted(lang['influenced_by'], key=lambda x: x['name'])],
        'paradigms': [i for i in sorted(paras, key=lambda x: x['name'])],
        'id': lang['id'],
        'label': lang['name']
    })

data = {
    'paradigms': [i[1] for i in sorted(paradigms.items(), key=lambda x: x[1]['count'], reverse=True)],
    'langs': langs
}

with open('data.json', 'w') as f:
    json.dump(data, f)

# create graph and save to file
G = nx.DiGraph()
for index, l in enumerate(langs):
    attr = {}
    attr['label'] = l['label']
    if l['paradigms']:
        attr['paradigms'] = '|'.join([p['name'] for p in l['paradigms']])
    if l['influenced']:
        attr['influenced'] = '|'.join([p['name'] for p in l['influenced']])
    if l['influencedby']:
        attr['influencedby'] = '|'.join([p['name'] for p in l['influencedby']])
    G.add_node(l['id'], attr)
    for i in l['influenced']:
        G.add_edge(l['id'], i['id'])

nx.write_gexf(G, graph_file, version='1.2draft')
