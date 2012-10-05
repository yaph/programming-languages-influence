# -*- coding: utf-8 -*-
# merge size, position and color from forceatlas2 with default data
import networkx as nx

Gdata = nx.read_gexf('plin.gexf', node_type=None)
Glayout = nx.read_gexf('plin_forceatlas2.gexf', node_type=None)

for n in Gdata.nodes(True):
    l = n[1]['label']
    if l in Glayout.node:
        Gdata.node[n[0]]['viz'] = Glayout.node[l]['viz']

nx.write_gexf(Gdata, 'plin.gexf')
