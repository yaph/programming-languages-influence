var langs = {
  defaultColor: '#eee',
  srcColor: '#67A9CF',
  dstColor: '#EF8A62',

  // vis is the element id of the visualization container
  init: function(vis) {
    langs.nodesbyid = {};
    var container = document.getElementById(vis);
    container.innerHTML = '';
    langs.sig = sigma.init(container).drawingProperties({
      defaultLabelColor: langs.defaultColor,
      defaultLabelSize: 14,
      defaultLabelBGColor: langs.defaultColor,
      defaultLabelHoverColor: '#000',
      labelThreshold: 6,
      defaultEdgeType: 'curve'
    }).graphProperties({
      minNodeSize: .5,
      maxNodeSize: 25,
      minEdgeSize: 1,
      maxEdgeSize: 1
    }).mouseProperties({
      maxRatio: 32
    });
  },

  nodeColor: function(cnt) {
    var color = '#EDF8E9';
    if (cnt > 40) color = '#006D2C';
    else if (cnt > 30) color = '#31A354';
    else if (cnt > 20) color = '#74C476';
    else if (cnt > 0) color = '#BAE4B3';
    return color;
  },

  addNode: function(node) {
    var nid = node['id'];
    langs.nodesbyid[nid] = true;
    langs.sig.addNode(nid, {
      x: Math.random(),
      y: Math.random(),
      size: node.size,
      color: langs.nodeColor(node.size),
      label: node.label,
      id: nid,
      influenced: node.influenced
    });
  },

  graph: function(data) {
    $.each(data, function(idx, node) {
      langs.addNode(node);
    });
    langs.sig.iterNodes(function(n){
      $.each(n.attr.influenced, function(idx, dst) {
        if (langs.nodesbyid[n.id] && langs.nodesbyid[dst.id]) {
          langs.sig.addEdge(n.id + dst.id, n.id, dst.id);
        }
      });
    });
    langs.events();
    langs.sig.draw();
  },

  events: function() {
    langs.sig.bind('overnodes',function(event){
      var hnode = langs.sig.getNodes(event.content)[0];
      if (0 == hnode.degree) return;
      var influenced = {};
      var influencedby = {};
      langs.sig.iterEdges(function(e){
        e.defaultColor = e.color;
        if (e.source == hnode.id) {
          e.color = langs.srcColor;
          influenced[e.target] = true;
        } else if (e.target == hnode.id) {
          e.color = langs.dstColor;
          influencedby[e.source] = true;
        } else {
          e.hidden = 1;
        }
      }).iterNodes(function(n){
        n.forceLabel = true;
        if (n.id != hnode.id) {
          if (influencedby[n.id]) {
            n.color = langs.dstColor;
          } else if (influenced[n.id]) {
            n.color = langs.srcColor;
          } else {
            n.hidden = 1;
            n.forceLabel = false;
          }
        }
      }).draw(2,2,2);
    }).bind('outnodes',function(event){
      var nodes = event.content;
      langs.sig.iterNodes(function(n){
        n.color = langs.nodeColor(n.attr.influenced.length);
        n.hidden = 0;
        n.forceLabel = false;
      }).iterEdges(function(e){
        e.hidden = 0;
        e.color = e.defaultColor;
      }).draw(2,2,2);
    });
  }

};
