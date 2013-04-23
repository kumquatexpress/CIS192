(function() {
  app.util.generate_hierarchy = function(id, data) {


    $(".edit-object").css("display", "none");
    $(".the-code").css("display","none");
    $(".warnings-panel").css("display","none");
    $("#hierarchy-wrapper").show();
    
    console.log("HERE IS THE DATA MOFO");
    console.log(data);

    // remove any existing value
    $('#hierarchy-wrapper').find('svg').remove();
    var width = $('#hierarchy-wrapper').width(),
      height = $(window).height();


    var root = data;

    var cluster = d3.layout.cluster()
      .size([height, width - 160])
      .children(function(d) {

      return d.classes || d.children;
    });

    var drag = d3.behavior.drag()
      .on("drag", function(d, i) {
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      d3.select(this).attr("transform", function(d, i) {
        return "translate(" + [d.x, d.y] + ")";
      });
    });
    var diagonal = d3.svg.diagonal()
      .projection(function(d) {
      return [d.y, d.x];
    });

    var svg = d3.select("#" + id).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(40,0)");


    // go through all the nodes, and check, if the nodes exist already, then add to the existing node's parents attribute

    function re_node(nodes) {
      var all_nodes = [];
      remove_nodes = [];
      // push all nodes to all_nodes
      _.each(nodes, function(node) {
        // instantiate its parents if it doesn't have it
        node.parents = node.parents || [];
        // check if its parents contains its parent, and it's not a project (contains projectid), otherwise push it on
        if (node.project_id && !_.findWhere(node.parents, {
          id: node.parent.id
        })) {
          node.parents.push(node.parent);
        }
        // if(!_.contains(node.parents, node.parent)){
        //   node.parents.push(node.parent);
        // }
        var existing_node = _.findWhere(all_nodes, {
          id: node.id,
          name: node.name
        });
        if (existing_node !== undefined) {
          // push the parent to the existing node
          existing_node.parents.push(node.parent);
          // remove it from its parent
          node.parent.children = _.without(node.parent.children, node);
          // remove it from nodes
          remove_nodes.push(node);



        } else {
          // otherwise, push it to the all_nodes
          all_nodes.push(node);
        }
      });
      nodes = _.difference(nodes, remove_nodes);
      return nodes;
    }

    // USE THIS LINKS METHOD INSTEAD OF THE BUILT IN LINKS METHOD FOR D3

    function create_links(nodes) {
      
      return d3.merge(nodes.map(function(parent) {
        var ret_array = [];
        _.each(parent.children, function(child) {
          _.each(child.parents, function(child_parent) {
            ret_array.push({
              source: child_parent,
              target: child
            });

          });
        });
        return ret_array;

      }));
    }

    var nodes = cluster.nodes(root);
    nodes = re_node(nodes);
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
      .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

    // level of shits
    node.append("circle")
      .attr("r", 4.5)
      .on('mouseover', function(d) {
        console.log(d);
        var temp = " <div>" ;
        
        if(d.methods.length === 0 && d.attributes.length === 0) {
          temp = "No attributes or methods"
        }
        if(d.methods.length > 0) {
          temp += "Attributes<br><div class='class-info-attrs'>";
          _.each(d.attributes, function(item){
            temp += item.name + "(" + item.attr_type + ')' + ': ' + item.description + "<br>";
          });
          temp += "</div>";
        }
        
        if(d.methods.length > 0) {
          temp += "Methods<br><div class='class-info-methods'>";
          _.each(d.methods, function(item){
            temp += item.name + "(" + item.ret + ')' + ': ' + item.description + "<br>";
          });
          temp += "</div>";
          // "</div>"
        }
        

        $('#class-info').css({
          left: $(this).offset().left - $('.detail-panel').outerWidth() + 10,
          top: $(this).offset().top,
          color: 'black'
        });
        $('#class-info').html(temp);
        $('#class-info').toggle();

      })
      .on('mouseout', function(d) {
      $('#class-info').toggle();
    })
      .on('mousedown', function(d) {
      app.util.details.loadClassDetail(d.id);
      $('.the-code').toggle();
      // hide
      $('#hierarchy-wrapper').toggle();
    });


    node.append("text")
      .attr("dx", function(d) {
      return d.children ? -8 : 8;
    })
      .attr("dy", 3)
      .attr("stroke", 'white')
      .style("text-anchor", function(d) {
      return d.children ? "end" : "start";
    })
      .text(function(d) {
      return d.name;
    });
    // });

    d3.select(self.frameElement).style("height", height + "px");
    // set draggable
    $('#hierarchy-wrapper svg').draggable();
  };
})();
