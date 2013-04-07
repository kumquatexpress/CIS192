function ruby_skeleton(_class, _interfaces)
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
	console.log(methods)

	//get parent info if exists
	var parent = _class.parents
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
		var parname = " < " + parent.join(", ")
	}

	//build the string
	class_string = class_string + "# " + description + "\n" + "class "
	class_string = class_string + name + parname  + "\n"
	if(attributes){
		for(var xy in attributes)
		{
			class_string = class_string + "\t" + ruby_attr_string(attributes[xy])
		}
	}

	//constructor setup here
	class_string = class_string + "\n"+ ruby_constructor(attributes)

	if(methods){
		for(var xy in methods)
		{
			class_string = class_string + "\t" + rubydoc(methods[xy])
			class_string = class_string + "\t" + ruby_method_string(methods[xy])
		}
	}

	class_string = class_string + "\nend"
	return {code: class_string, warnings: _warnings}
}

function ruby_attr_string(attr)
{
	var attr_scope = ""
	if(attr.scope == "private")
	{
		attr_scope = "attr_reader "
	}
	else
	{
		attr_scope = "attr_accessor "
	}
	return attr_scope + " :" + attr.name + "\n"
}

function ruby_method_string(method)
{
	var arguments = []
	for(var xy in method.args)
	{
		arguments.push(method.args[xy].name)
	}
	var argument_string = arguments.join(", ")

	return "def "+ method.name + "(" +
		argument_string + ")\n\t\t#TODO\n\tend\n"
}

function rubydoc(method)
{
	var retstring = "\n\t# " + method.description + "\n"
	retstring = retstring + "\t# Params:\n"
	for(var xy in method.args)
	{
		retstring = retstring + "\t# " + "+" + method.args[xy].name + "+:: " + 
		method.args[xy].description + "\n"
	}
	return retstring
}

function ruby_constructor(attributes)
{
	var attr = []
	var initstring = []
	if(attributes[0])
	{
		for(var x in attributes)
		{
			attr.push(attributes[x].name)
			initstring.push("@"+attributes[x].name+" = "+attributes[x].name)
		}
	}
	return "\tdef initialize("+attr.join(", ")+")\n"+
		"\t\t"+initstring.join("\n\t\t")+"\n\tend\n"
}