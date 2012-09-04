var width = 1200,
    height = 900;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);

svg.append('svg:defs').selectAll('marker')
    .data(['influenced'])
  .enter().append('svg:marker')
    .attr('id', String)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 15)
    .attr('refY', -1.5)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5');

d3.json('langs.json', function(json) {
  var nodes = [];
  var links = [];
  var langs = {};
  json.result.map(function(l){
    if (l.influenced.length >= 0) {
console.log(l);
      nodes.push(l);
      langs[l['id']] = nodes.length - 1;
    }
  });

  nodes.map(function(n){
//    links.push({'source': n.index, 'target': langs[n.id]});
    n.influenced.map(function(l){
      if ('undefined' !== typeof langs[l.id])
        links.push({'source': langs[n.id], 'target': langs[l.id]});
    });
  });

  var rscale = function(n) {
    return (n / 2 || 1);
  };

  force
      .nodes(nodes)
      .links(links)
      .start();

//  var link = svg.selectAll('.link')
//      .data(links)
//    .enter().append('line')
//      .attr('class', 'link');

  var path = svg.append('svg:g').selectAll('path')
    .data(links)
  .enter().append('svg:path')
    .attr('class', 'link')
    .attr('marker-end', function(d) { return 'url(#influenced)'; });

  var node = svg.selectAll('.node')
      .data(nodes)
    .enter().append('g')
      .attr('class', 'node')
      .call(force.drag);

    node.append('circle')
        .attr('r', function(d) { return rscale(d.influenced.length) });

    node.append('text')
      .attr('dx', function(d) { return rscale(d.influenced.length) })
      .attr('dy', '.35em')
      .attr('style', function(d) { return 'font-size:' + rscale(d.influenced.length) + 'px'; })
      .text(function(d) { return d.name });

    node.call(force.drag);

  force.on('tick', function() {
//    link.attr('x1', function(d) { return d.source.x; })
//        .attr('y1', function(d) { return d.source.y; })
//        .attr('x2', function(d) { return d.target.x; })
//        .attr('y2', function(d) { return d.target.y; });

    path.attr('d', function(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
      });

    node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  });
});
