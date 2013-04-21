(function(){
app.util.generate_hierarchy = function(id, data){
var width = $('#hierarchy-wrapper').width(),
    height = $(window).height();


  var root = data;

  var cluster = d3.layout.cluster()
    .size([height, width - 160])
    .children(function(d){
      
      return d.classes || d.children;
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


    // go through all the nodes, and check, if the nodes exist already, then add to the existing node's parents attribute
    function re_node(nodes){
      var all_nodes = [];
      remove_nodes = [];
      // push all nodes to all_nodes
      _.each(nodes, function(node) {
        // instantiate its parents if it doesn't have it
        node.parents = node.parents || [];
        // check if its parents contains its parent, otherwise push it on
        if(!_.contains(node.parents, node.parent)){
          node.parents.push(node.parent);
        }
        var existing_node = _.findWhere(all_nodes, {id: node.id, name: node.name});
        if(existing_node !== undefined){
          // push the parent to the existing node
          existing_node.parents.push(node.parent);
          // remove it from its parent
          node.parent.children = _.without(node.parent.children, node);
          // remove it from nodes
          remove_nodes.push(node)
          existing_node.parents.push(node.parent)
        
          

        } else {
          // otherwise, push it to the all_nodes
          all_nodes.push(node);
        }
      });
      console.log(2893749824)
        console.log(remove_nodes)
      nodes = _.difference(nodes, remove_nodes);
      return nodes;
    }

    // USE THIS LINKS METHOD INSTEAD OF THE BUILT IN LINKS METHOD FOR D3
    function create_links(nodes) {
      // creates links for nodes with multiple parents
      // console.log(d3.merge(nodes.map(function(parent) {
      //   var ret_array;
      //   console.log('hihihuwehfuhefu')
      //     console.log(this)
      //   _.each(parent.children, function(child) {
          
      //     _.each(child.parents, function(child_parent) {
      //       console.log(this)
      //       ret_array.push({
      //         source: child_parent,
      //         target: child
      //       });

      //     }, this);
      //   }, this);
      //   return ret_array;

      // })));


      return d3.merge(nodes.map(function(parent) {
        var ret_array = [];
        _.each(parent.children, function(child) {
          _.each(child.parents, function(child_parent) {
            console.log("THIS IS SPARTA")
            console.log(child_parent)
            ret_array.push({
              source: child_parent,
              target: child
            });

          });
        });
        console.log(ret_array)
        return ret_array;

      }));
        // console.log(d3.merge(nodes.map(function(parent) {
        // return (parent.children || []).map(function(child) {
        //   return {
        //     source: parent,
        //     target: child
        //   };
        //   });
        // })));
      
      // return d3.merge(nodes.map(function(parent) {
      //   return (parent.children || []).map(function(child) {
      //     return {
      //       source: parent,
      //       target: child
      //     };
      //   });
      // }));
    }
    
    var nodes = cluster.nodes(root);
    nodes = re_node(nodes);
    console.log('the nodes')
    console.log(nodes)
    var links = create_links(nodes);

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
        })
        .on('mousedown', function(d) {
          console.log('this')
          console.log(this)
          console.log(d);
          app.util.details.loadClassDetail(d.id);
          // hide
          $('#hierarchy-wrapper').toggle();
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
