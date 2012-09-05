$(function(){
  var nodes = {};
  var sig = sigma.init(document.getElementById('sig')).drawingProperties({
    defaultLabelColor: '#fff',
    defaultLabelSize: 14,
    defaultLabelBGColor: '#fff',
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

  var addNode = function(node) {
    var nid = node['id'];
    if (!nodes.hasOwnProperty(nid)) {
      if (!node.hasOwnProperty('influenced')) {
        node.influenced = [];
      }
      nodes[nid] = node;
      sig.addNode(nid, {
        x: Math.random(),
        y: Math.random(),
        size: node.influenced.length,
        color: '#fff',
        label: node.name,
        id: nid,
        influenced: node.influenced
      });
    }
  };

  $.getJSON('langs.json', function(data) {
    $.each(data.result, function(key, src) {
      addNode(src);
    });

    sig.iterNodes(function(n){
      $.each(n.attr.influenced, function(key, dst) {
        if (nodes.hasOwnProperty(n.id) && nodes.hasOwnProperty(dst.id)) {
          sig.addEdge(n.id + dst.id, n.id, dst.id);
        }
      });
    });

    // events
    var greyColor = '#333';
    var srcColor = '#67A9CF';
    var dstColor = '#EF8A62';

    sig.bind('overnodes', function(event){
      var nodes = event.content; // array containing hovered node
      var neighbors = {};
      sig.iterEdges(function(e){
        // not connected to hovered node
        if(nodes.indexOf(e.source)<0 && nodes.indexOf(e.target)<0){
          if(!e.attr['grey']){
            e.attr['true_color'] = e.color;
            e.color = greyColor;
            e.attr['grey'] = 1;
          }
        } else {
          if (-1 !== nodes.indexOf(e.source)) {
            e.color = srcColor;
          } else if (-1 !== nodes.indexOf(e.target)) {
            e.color = dstColor;
          }
          e.attr['grey'] = 0;
          neighbors[e.source] = 1;
          neighbors[e.target] = 1;
        }
      }).iterNodes(function(n){
        if(!neighbors[n.id]){
          if(!n.attr['grey']){
            n.attr['true_color'] = n.color;
            n.color = greyColor;
            n.attr['grey'] = 1;
          }
        } else {
          n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
          n.attr['grey'] = 0;
        }
      }).draw(2,2,2);
    }).bind('outnodes',function(){
      sig.iterEdges(function(e){
        e.color = e.attr['grey'] ? e.attr['true_color'] : e.color;
        e.attr['grey'] = 0;
      }).iterNodes(function(n){
        n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
        n.attr['grey'] = 0;
      }).draw(2,2,2);
    });

    sig.draw();

  });
});
