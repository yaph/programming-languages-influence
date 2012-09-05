$(function(){
  var defaultColor = '#eee';
  var srcColor = '#67A9CF';
  var dstColor = '#EF8A62';
  var nodesbyid = {};
  var paradigms = {};

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

  var nodeColor = function(cnt) {
    var color = '#EDF8E9';
    if (cnt > 40) color = '#006D2C';
    else if (cnt > 30) color = '#31A354';
    else if (cnt > 20) color = '#74C476';
    else if (cnt > 0) color = '#BAE4B3';
    return color;
  };

  var addNode = function(node) {
    var nid = node['id'];
    var icnt = node.influenced.length;
    nodesbyid[nid] = true;
    sig.addNode(nid, {
      x: Math.random(),
      y: Math.random(),
      size: icnt,
      color: nodeColor(icnt),
      label: node.label,
      id: nid,
      influenced: node.influenced
    });
  };


  $.getJSON('data.json', function(data) {
    $.each(data.langs, function(idx, node) {
      addNode(node);
    });
    sig.iterNodes(function(n){
      $.each(n.attr.influenced, function(idx, dst) {
        if (nodesbyid[n.id] && nodesbyid[dst.id]) {
          sig.addEdge(n.id + dst.id, n.id, dst.id);
        }
      });
    });

    // events
    sig.bind('overnodes',function(event){
      var hnode = sig.getNodes(event.content)[0];
      if (0 == hnode.degree) return;
      var influenced = {};
      var influencedby = {};
      sig.iterEdges(function(e){
        e.defaultColor = e.color;
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
      sig.iterNodes(function(n){
        n.color = nodeColor(n.attr.influenced.length);
        n.hidden = 0;
        n.forceLabel = false;
      }).iterEdges(function(e){
        e.hidden = 0;
        e.color = e.defaultColor;
      }).draw(2,2,2);
    });

    sig.draw();
  });
});
