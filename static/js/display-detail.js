function loadProjectDetail() {
	$("#current-project-id").text(project.id);
	$(".project-info .title").text(project.name);
	$(".project-info .description").text(project.description);
	$(".add-attributes").css("display", "none")
	$(".add-methods").css("display", "none")
	update_hierarchy(project);
}

function loadClassDetail(class_id) {
	for(var i in project.classes) {
		if(project.classes[i].id == class_id) {
			var the_class = project.classes[i];
			console.log(the_class);
			$("#current-object-type").text("class");
			$("#current-object-id").text(the_class.id);
			loadObjectDetail(the_class);
		}
	}
	update_codeview(the_class, project.interfaces, "class", "java")
}
function loadInterfaceDetail(interface_id) {
	for(var i in project.interfaces) {
		if(project.interfaces[i].id == interface_id) {
			var the_interface = project.interfaces[i];
			$("#current-object-type").text("interface");
			$("#current-object-id").text(the_interface.id);
			loadObjectDetail(the_interface);
		}
	}
	update_codeview(the_interface, project.interfaces, "class", "java")
}

function loadObjectDetail(the_obj) {
		loadObjInfoDetail(the_obj);
		loadMethodsDetail(the_obj);
		resetAddAttribute();  
		resetAddMethod();
		$(".edit-object").show();
		$(".add-attributes").css("display", "inline")
		$(".add-methods").css("display", "inline")
}

function loadObjInfoDetail(the_obj) {
			var edit_obj = $(".edit-object");	
			edit_obj.attr("id","edit-object-"+the_obj.id);
			edit_obj.find(".info .name").html("<span>"+the_obj.name+"</span>");
			edit_obj.find(".info .description").text(the_obj.description);
			var rels = edit_obj.find(".info .relations");
			rels.html("");
			for(var i in the_obj.parents) {
				rels.append('<div class="parent">'+the_obj.parents[i]+'</div>');
			}
			for(var i in the_obj.interfaces) {
				rels.append('<div class="interface">'+the_obj.interfaces[i]+'</div>');
			}
			rels.append('<input class="add-parent" type="text" placeholder="ParentClass"/>');
			rels.append('<input class="add-interface" type="text" placeholder="MyInterface"/>');
			var attrs = edit_obj.find(".attributes");
			attrs.html("<h3>Attributes</h3");
			for(var j in the_obj.attributes) {
				var the_attr = the_obj.attributes[j];
				attrs.append('<div class="attribute">'+
				'<div class="vital-info">'+
					'<div class="scope">'+the_attr.scope+'</div>'+
					'<div class="name"><span>'+the_attr.name+'</span></div>'+
					'<div class="type">'+the_attr.attr_type+'</div>'+
					'<div id="delete-attribute-'+the_attr.name+'" class="delete">Delete</div>'+
				'</div>'+
				'<div class="description">'+the_attr.description+'</div>'+
				'</div>');
			}
		classListeners();
		attributeListeners();
}
function loadMethodsDetail(the_obj) { 
			var edit_obj = $(".edit-object");
	
			var meths = edit_obj.find(".methods");
			meths.html("<h3>Methods</h3>");
			for(var j in the_obj.methods) {
				var the_method = the_obj.methods[j];
				meths.append('<div class="method">'+
				'<div class="vital-info">'+
					'<div class="scope">'+the_method.scope+'</div>'+
					'<div class="name"><span>'+the_method.name+'</span></div>'+
					'<div class="return-type">'+the_method.ret+'</div>'+
					'<div id="delete-method-'+the_method.id+'" class="delete">Delete</div>'+
				'</div>'+
				'<div class="description">'+the_method.description+'</div>'+
				'<div class="arguments"></div>'+
				'</div>');
				var args = meths.find('.method:last .arguments');
				for(var k in the_method.args) {
					var the_arg = the_method.args[k];
					args.append('<div class="argument">'+
					'<div class="vital-info">'+
						'<div class="name"><span>'+the_arg.name+'</span></div>'+
						'<div class="type">'+the_arg.attr_type+'</div>'+
						'<div class="description">'+the_arg.description+'</div>'+
						'<div id="delete-argument-'+the_arg.name+'" class="delete">Delete</div>'+
					'</div>'+
					'</div>');
				}
				args.append('<div class="toggle-add-argument">Add Argument</div>');
				args.append('<div class="add-argument">'+
								'<div class="method-id">'+the_method.id+'</div>'+
								'<div class="form-state">0</div>'+
								'<div class="argument-prompt prompt"></div>'+
								'<div class="argument-preview preview"></div>'+
								'<div class="argument-form">'+
										'<input class="argument-textbox" type="text" />'+
								'</div>'+
				'</div>');
			}
	 
		methodListeners();  
}


function modifyClassDetail(class_obj){
	
}
