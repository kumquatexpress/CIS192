var width = 960,
    height = 2200;

var cluster = d3.layout.cluster()
  .size([height, width - 160])
  .children(function(d){
    return d.classes;
  });

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(40,0)");

d3.json("data.json", function(error, root) {
  // set to default for now, future needs to change to "class"
  console.log(root);
  
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
      .on('mousedown', function(x, i) {
        console.log(x); 
        console.log(i); 
        console.log(this);
        d3.select(this).transition()
          .attr('r', '10');
        // transform the links as well
        console.log(link)
        d3.select(link[0][i]).transition().attr('x', function(x, i) {
          return x + 5;
        });
        
      });

  // console.log(node.value());

  node.append("text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 3)
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.name; });
});

d3.select(self.frameElement).style("height", height + "px");
