(function(){
var width = 960,
    height = 2200;

app.util.generate_hierarchy = function(id, data){
  var root = data;

  var cluster = d3.layout.cluster()
    .size([height, width - 160])
    .children(function(d){
      return d.classes;
    });

  var drag = d3.behavior.drag()
        .on("drag", function(d,i) {
            d.x += d3.event.dx;
            d.y += d3.event.dy;
            d3.select(this).attr("transform", function(d,i){
                return "translate(" + [ d.x,d.y ] + ")";
            });
        });
  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

  var svg = d3.select("#" + id).append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(40,0)");


  // d3.json("static/data.json", function(error, root) {
    // set to default for now, future needs to change to "class"
    // console.log(root);
    
    var nodes = cluster.nodes(root),
        links = cluster.links(nodes);

    var link = svg.selectAll(".link")
        .data(links)
      .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);

    var node = svg.selectAll(".node")
        .data(nodes)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    // level of shits
    node.append("circle")
        .attr("r", 4.5)
        .on('mouseover', function(d) {
          console.log('YEAH BRO');
          // console.log(x); 
          // console.log(i); 
          // console.log(this);
          // console.log(d3.select(this).select("text"))
          // d3.select(this).select("text").style("dx", -2);
          console.log(d);
          // d3.select(d).transition().attr('r', '100')
          // d3.select(this).transition()
          //   .attr('r', '10');
          // transform the links as well
          // console.log(link)
          // d3.select(link[0][i]).transition().attr('x', function(x, i) {
            // return x + 5;
          // });
          // console.log(_.template(hover_template)())
          console.log($(this).offset())
          // $('#method-info').prepend(_.template(hover_template)());
          $('#class-info').css({left: $(this).offset().left, top: $(this).offset().top});
          $('#class-info').toggle();
          
        })
        .on('mouseout', function(d) {
          $('#class-info').toggle();
        });

    // console.log(node.value());

    node.append("text")
        .attr("dx", function(d) { return d.children ? -8 : 8; })
        .attr("dy", 3)
        .attr("stroke", 'white')
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { return d.name; });
  // });

  d3.select(self.frameElement).style("height", height + "px");
  // set draggable
  $('#hierarchy-wrapper svg').draggable();
};
})();
