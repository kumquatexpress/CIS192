function python_skeleton(_class, _interfaces)
{
	var class_string = ""
	var _warnings = []

	//get class info
	var id = _class.id
	var name = _class.name
	var description = _class.description
	var attributes = _class.attributes

	//get methods
	var methods = _class.methods

	//get parent info if exists
  var parent = _.pluck(_.filter((_class.parents), function(item){
    return item.project_id !== undefined;
  }), 'name');	
	var parname = ""

	//get interfaces info if exists
	var interfaces = _class.interfaces

	for(var inter in interfaces)
	{
		if(parent.indexOf(interfaces[inter]) == -1)
		{
			parent.push(interfaces[inter])

			for(var _inter in _interfaces)
			{
				if(interfaces[inter] == _interfaces[_inter].name)
				{
					for(var meth_y in _interfaces[_inter].methods)
					{
						var method_x = _interfaces[_inter].methods[meth_y]
						if(methods.indexOf(method_x) == -1)
						{
							methods.push(method_x)
						}
					}
				}
			}
		}
	}

	//build the parents array before creating string in ruby,
	//treating interfaces like parents because there are no interfaces
	if (parent[0])
	{
		var parname = " extends " + parent.join(", ")
	}

	//build the string
	class_string = class_string + "# " + description + "\n" + "class "
	class_string = class_string + name + parname  + "\n\n"

	//build constructor
	class_string = class_string + "\t" + python_constructor(attributes)

	if(methods){
		for(var xy in methods)
		{
			class_string = class_string + "\t" + python_method_string(methods[xy])
		}
	}

	return {code: class_string, warnings: _warnings}
}

function python_method_string(method)
{
	var arguments = ["self"]
	var inputs = []
	for(var xy in method.arguments)
	{
		arguments.push(method.arguments[xy].name)
		inputs.push(":param "+ method.arguments[xy].name+": " +
			method.arguments[xy].description)
	}
	var argument_string = arguments.join(", ")

	return "def "+ method.name + "(" +
		argument_string + ")\n\t\t\"\"\"" + method.description +
		"\n\t\t"+inputs.join("\n\t\t")+"\"\"\"\n\t\t#TODO\n\n"
}

function python_constructor(attr)
{
	var arguments = ["self"]
	var initialize_string = []
	if(attr[0])
	{
		for(var xy in attr)
		{
			arguments.push(attr[xy].name)
			initialize_string.push("self"+"."+attr[xy].name+" = "+attr[xy].name)
		}
	}
	return "def __init__(" + arguments.join(", ") + ")\n\t\t\"\"\"Constructor\"\"\"\n\t\t" +
		initialize_string.join("\n\t\t") + "\n\n"
}
