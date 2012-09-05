// TODO cache created graphs in localStorage and show cached when paradigm is selected

$(function(){
  var pmenu = $('#paradigms');
  var graphdata = null;
  langs.init('sig');
  pmenu.click(function(e){
    e.preventDefault();
    if ('a' == e.target.nodeName.toLowerCase()) {
      pmenu.find('li').removeClass('active');
      var t = $(e.target);
      var pid = t.attr('href');
      t.parent('li').addClass('active');
      var graphlangs = [];
      if (pid) {
        for (i in graphdata.langs) {
          var lang = graphdata.langs[i];
          for (j in lang.paradigms) {
            var p = lang.paradigms[j];
            if (pid == p.id) {
              graphlangs.push(lang);
              break;
            }
          }
        }
      } else {
        graphlangs = graphdata.langs;
      }
      langs.init('sig');
      langs.graph(graphlangs);
    }
  });
  $.getJSON('data.json', function(data) {
    $.each(data.paradigms, function(idx, item) {
      pmenu.append('<li><a href="' + item.id + '">' + item.name + '</a></li>');
    });
    langs.graph(data.langs);
    graphdata = data;
  });
});
