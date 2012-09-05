$(function(){
  var defaultColor = '#fff';
  var nodesbyid = {}
  var sig = sigma.init(document.getElementById('sig')).drawingProperties({
    defaultLabelColor: defaultColor,
    defaultLabelSize: 14,
    defaultLabelBGColor: defaultColor,
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
    nodesbyid[nid] = true;
    sig.addNode(nid, {
      x: Math.random(),
      y: Math.random(),
      size: node.influenced.length,
      color: '#fff',
      label: node.name,
      id: nid,
      influenced: node.influenced
    });
  };

  $.getJSON('langs.json', function(data) {
    $.each(data.result, function(key, src) {
      addNode(src);
    });

    sig.iterNodes(function(n){
      $.each(n.attr.influenced, function(key, dst) {
        if (nodesbyid[n.id] && nodesbyid[dst.id]) {
          sig.addEdge(n.id + dst.id, n.id, dst.id);
        }
      });
    });

    var srcColor = '#67A9CF';
    var dstColor = '#EF8A62';

    // events
    sig.bind('overnodes',function(event){
      var hnode = sig.getNodes(event.content)[0];
      if (0 == hnode.degree) return;
      var influenced = {};
      var influencedby = {};
      sig.iterEdges(function(e){
        if (e.source == hnode.id) {
          e.color = srcColor;
          influenced[e.target] = true;
        } else if (e.target == hnode.id) {
          e.color = dstColor;
          influencedby[e.source] = true;
        } else {
          e.hidden = 1;
        }
      }).iterNodes(function(n){
        n.forceLabel = true;
        if (n.id != hnode.id) {
          if (influencedby[n.id]) {
            n.color = dstColor;
          } else if (influenced[n.id]) {
            n.color = srcColor;
          } else {
            n.hidden = 1;
            n.forceLabel = false;
          }
        }
      }).draw(2,2,2);
    }).bind('outnodes',function(event){
      var nodes = event.content;
      sig.iterEdges(function(e){
        e.color = defaultColor;
        e.hidden = 0;
      }).iterNodes(function(n){
        n.color = defaultColor;
        n.hidden = 0;
        n.forceLabel = false;
      }).draw(2,2,2);
    });

    sig.draw();
  });
});
