function update_hierarchy(project)
{
	$('#canvas').html("")
	var _classes = (project.classes).concat(project.interfaces)
	var boxes = []

	var org = Joint.dia.org

	console.log(org)
	var world_paper = Joint.paper(document.getElementById("canvas"));

	var extensions = []
	var implementations = []
	var _ids = []
	var x_dists = []

	for(var x in _classes)
	{
		var detail_string = ""
		if(project.classes.indexOf(_classes[x]) != -1)
		{
			detail_string = "Class"
		}
		else if(project.interfaces.indexOf(_classes[x]) != -1)
		{
			detail_string = "Interface"
		}

		var depth = 0
		var temp = _classes[x]

		for(var _inter in temp.interfaces)
		{
			for(var _cl in _classes)
			{
				if(_classes[_cl].name == temp.interfaces[_inter])
				{
					implementations.push([x, _cl])
				}
			}
		}

		while(temp.parents && temp.parents[0])
		{
			for(var par in temp.parents)
			{
				for(var _cl in _classes)
				{
					if(_classes[_cl].name == temp.parents[par])
					{
						extensions.push([x, _cl])
						temp = _classes[_cl]
					}
				}
			}
			depth += 1
		}
		var _fill = "red"

		if(depth > 0)
		{
			_fill = "orange"
		}
		if(depth > 1)
		{
			_fill = "yellow"
		}
		if(depth > 2)
		{
			_fill = "green"
		}
		if(depth > 3)
		{
			_fill = "blue"
		}

		var x_width = 140
		if(world_paper.width/(_classes.length) < 140)
		{
			x_width = world_paper.width/(_classes.length)
		}
		var x_dist = (world_paper.width/(_classes.length))*x

		var box = org.Member.create({
			rect: {x: x_dist, y: (world_paper.height/3)*depth+10*x, width: x_width, height: 60},
			name: _classes[x].name,
			position: detail_string,
			attrs: {fill : _fill, stroke:'white'}
		});
		x_dists.push(x_dist)

		box.draggable(false);

		_ids.push(_classes[x].id)
		box.wrapper.click(function(){
			loadClassDetail(_ids[boxes.indexOf(this)]);
		});

		boxes.push(box.wrapper)
	}
	for(var conn in extensions)
	{
		var tuple = extensions[conn]
		boxes[tuple[0]].joint(boxes[tuple[1]], {
			label: "extends",
			labelAttrs: {
				position: 0
			},
			color: "white",
			beSmooth: "true",
			startArrow: {
				type: "none",
				size: 0,
				attrs: {
					fill: "green",
					stroke: "white"
				}
			},
			endArrow: {
				type: "basic",
				size: 10,
				attrs: {
					fill: "green",
					stroke: "white",
				}
			}
		}).highlight("white");
	}
	for(var conn in implementations)
	{
		var tuple = implementations[conn]
		boxes[tuple[0]].joint(boxes[tuple[1]], {
			label: "implements",
			labelAttrs: {
				position: 0
			},
			beSmooth: "true",
			startArrow: {
				type: "none",
				size: 0,
				attrs: {
					fill: "white",
					stroke: "black"
				}
			},
			endArrow: {
				type: "basic",
				size: 10,
				attrs: {
					fill: "white",
					stroke: "black"
				}
			}
		}).highlight("white");
	}
}