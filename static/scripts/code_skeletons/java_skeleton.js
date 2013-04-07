function java_skeleton(_class, _interfaces, flag)
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
	var parent = _class.parents
	var parname = ""
	if (parent[0])
	{
		var parname = " extends " + parent.join(", ")
	}

	//get interfaces info if exists
	var interfaces = _class.interfaces

	for(var inter in interfaces)
	{
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

	var intstring = ""
	if(interfaces[0])
	{
		intstring = " implements " + interfaces.join(", ")
	}

	if(flag == "class")
	{
		//build the string for a class
		class_string = class_string + "/* " + description + 
		" */\n" + "public class "
		class_string = class_string + name + parname + 
		intstring + " {\n"
	}
	else if(flag == "interface")
	{
		//build the string for an interface
		class_string = class_string + "/* " + description + 
		" */\n" + "public interface "
		class_string = class_string + name + parname + 
		intstring + " {\n"	
	}
	if(attributes[0]){
		for(var xy in attributes)
		{
			class_string = class_string + "\t" + attr_string(attributes[xy], _warnings)
		}
	}

	if(flag == "class")
	{
		//init constructor here
		class_string = class_string + "\n"+ java_constructor(_class)
	}

	if(methods[0]){
		for(var xy in methods)
		{
			class_string = class_string + "\t" + javadoc(methods[xy])
			class_string = class_string + "\t" + method_string(methods[xy], _warnings)
		}
	}
	class_string = class_string + "\n}"
	return {code: class_string, warnings: _warnings}
}

function attr_string(attr, warn)
{
	console.log(attr)
	var attr_name = check_warnings(attr.attr_type, warn)
	return attr.scope + " " + attr_name + " " + attr.name + ";\n"
}

function method_string(method, warn)
{
	var arguments = []
	for(var xy in method.args)
	{
		arguments.push(method.args[xy].attr_type + " " + method.args[xy].name)
	}
	var argument_string = arguments.join(", ")
	var ret_type = check_warnings(method.ret, warn)

	return method.scope + " " + ret_type + " " + method.name + "(" +
		argument_string + ")\n\t{\n\t\t//TODO\n\t}\n"
}

function javadoc(method)
{
	var retstring = "\n\t/* \n"
	retstring = retstring + "\t* " + method.description + "\n"
	for(var xy in method.args)
	{
		retstring = retstring + "\t* " + "@param " + method.args[xy].name + " " + 
		method.args[xy].description + "\n"
	}
	retstring = retstring + "\t* " + "@return " +  method.ret + "\n\t*/\n"
	return retstring
}

function java_constructor(_class)
{
	var attr = []
	var initstring = []
	if(_class.attributes)
	{
		for(var a in _class.attributes)
		{
			attr.push(_class.attributes[a].attr_type + " " +
				_class.attributes[a].name)
			initstring.push("this"+"."+_class.attributes[a].name+" = "+
				_class.attributes[a].name+";")
		}
	}
	var longattrstring = attr.join(", ")
	var counter = 0
	for(var chars in longattrstring)
	{
		if(longattrstring[chars] == ",")
		{
			counter += 1
		}
		if(counter % 4 == 0 && counter > 0)
		{
			longattrstring = longattrstring.insert(chars, "\n\t")
			counter = 0
		}
	}

	return "\tpublic " + _class.name +"("+longattrstring+
		"){\n\t\t"+initstring.join("\n\t\t")+"\n"+"\t}\n"
}

function check_warnings(name, warn)
{
	var types = ["int", "double", "float", "boolean", "char", "String",
		"long", "short", "void"]
	for(var c in project.classes)
	{
		types.push(project.classes[c].name)
	}

	var attr_type = name.toLowerCase()

	if (attr_type)
	{
		if(attr_type.search("count") != -1 || attr_type.search("num") != -1 || attr_type.search("int") != -1)
		{
			attr_type = "int"
		}
		else if(attr_type.search("word") != -1 || attr_type.search("sentence") != -1 || attr_type.search("string") != -1)
		{
			attr_type = "String"
		}
		else if(attr_type.search("deci") != -1 || attr_type.search("double") != -1)
		{
			attr_type = "double"
		}
		else if(attr_type.search("bool") != -1 || attr_type.search("true") != -1 || attr_type.search("false") != -1)
		{
			attr_type = "boolean"
		}
		else if(types.indexOf(attr_type) == -1)
		{
			warn.push("Unknown type " + attr_type + " could cause an error.")
			attr_type = name
		}
	}
	return attr_type
}

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};