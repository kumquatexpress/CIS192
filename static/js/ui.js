function detailListeners() {
	$(".add-controls .add-class").click(function() {
			$("#add-class").show();
			$("#add-method").hide();
			$("#add-attribute").hide();
	});
	$(".add-controls .add-attributes").click(function() {
		if(!$(this).hasClass("disabled")) {
			$("#add-attribute").show();
			$("#add-class").hide();
			$("#add-method").hide();
		}
	});
	$(".add-controls .add-methods").click(function() {
		if(!$(this).hasClass("disabled")) {
			$("#add-attribute").hide();
			$("#add-class").hide();
			$("#add-method").show();
		}
	});
	resetAddClass();
	resetAddAttribute();
	resetAddMethod();
}

function resetAddClass() {
	var the_class = {name : "", description : "", parents : [], attributes : [], interfaces : []}
	$("#class-name-textbox").val("");
	$("#class-description-textbox").val("Description of MyClass");
	$("#create-class").unbind("click");
	$("#create-class").click(function() {
		the_class.name = $("#class-name-textbox").val();
		the_class.description = $("#class-description-textbox").val();
		the_class.project = $("#current-project-id").text();
		var data = {
			action : "add",
			type : $("#class-type").val(),
			info : the_class,
			project_id : $("#current-project-id").text()
		};
		saveAction(data);
		resetAddClass();
		$("#add-class").hide();
	});
}

function resetAddAttribute() {
	var the_attribute = {name : "", attr_type : "", description : "", scope : "private"};
	$('.attribute-prompt').html("Enter an attribute name <span>Press enter to continue</span>");
	$('.attribute-preview').html("");
	$("#add-attribute .form-state").text("0");
	$("#attribute-textbox").val("");
	$("#attribute-textbox").attr("placeholder","Start typing");
	$('#attribute-textbox').unbind('keydown');
	$('#attribute-textbox').keydown(function(event) {
		if(event.keyCode == 13) {
			
		switch($("#add-attribute .form-state").text()) {
			case "0":
				$('.attribute-prompt').html("Enter the attribute's type <span>Press enter to continue, esc to cancel</span>");
				the_attribute.name = $("#attribute-textbox").val();
				$('.attribute-preview').append("<div class='name'>"+the_attribute.name+"</div>");
				$("#add-attribute .form-state").text("1");
				$("#attribute-textbox").val("");
				break;
			case "1":
				$('.attribute-prompt').html("Enter the attribute's description <span>Press enter to continue, esc to cancel</span>");
				the_attribute.attr_type = $("#attribute-textbox").val();
				$('.attribute-preview').append("<div class='type'>"+the_attribute.attr_type+"</div>");
				$("#add-attribute .form-state").text("2");
				$("#attribute-textbox").val("");
				break;
			case "2":
				the_attribute.description = $("#attribute-textbox").val();
				var obj_type = $("#current-object-type").text();
				var modified_class = getInterClass($("#current-object-id").text(),obj_type);
				modified_class.attributes.push(the_attribute);
				var data = {
					action : "modify",
					type : obj_type,
					info : modified_class,
					project_id : $("#current-project-id").text()
				}
				console.log(data);
				saveAction(data);
				resetAddAttribute();
				break;
		}
			
		}
		if(event.keyCode == 27) {
				resetAddAttribute();
		}
	});
}

function resetAddArgument(the_method) {
	var the_argument = {name : "", attr_type : "", description : ""};
	the_method.find('.argument-prompt').html("Enter an argument name <span>Press enter to continue</span>");
	the_method.find('.argument-preview').html("");
	the_method.find(".add-argument .form-state").text("0");
	the_method.find(".argument-textbox").val("");
	the_method.find(".argument-textbox").attr("placeholder","Start typing");
	the_method.find('.argument-textbox').unbind('keydown');
	the_method.find('.argument-textbox').keydown(function(event) {
		if(event.keyCode == 13) {
			
		switch(the_method.find(".add-argument .form-state").text()) {
			case "0":
				the_method.find('.argument-prompt').html("Enter the argument's type <span>Press enter to continue, esc to cancel</span>");
				the_argument.name = the_method.find(".argument-textbox").val();
				the_method.find('.argument-preview').append("<div class='name'>"+the_argument.name+"</div>");
				the_method.find(".add-argument .form-state").text("1");
				the_method.find(".argument-textbox").val("");
				break;
			case "1":
				the_method.find('.argument-prompt').html("Enter the argument's description <span>Press enter to continue, esc to cancel</span>");
				the_argument.attr_type = the_method.find(".argument-textbox").val();
				the_method.find('.argument-preview').append("<div class='type'>"+the_argument.attr_type+"</div>");
				the_method.find(".add-argument .form-state").text("2");
				the_method.find(".argument-textbox").val("");
				break;
			case "2":
				the_argument.description = the_method.find(".argument-textbox").val();
				var modified_method = getMethod(
				the_method.find(".method-id").text(),
				$("#current-object-id").text(),
				$("#current-object-type").text()
				);
				modified_method.args.push(the_argument);
				var data = {
					action : "modify",
					type : "method",
					info : modified_method,
					project_id : $("#current-project-id").text()
				}
				console.log(data);
				saveAction(data);
				resetAddArgument(the_method);
				break;
		}
			
		}
		if(event.keyCode == 27) {
				resetAddArgument(the_method);
		}
	});
}
function resetAddMethod() {
	var the_method = {name : "", ret : "", description : ""};
	$('.method-prompt').html("Enter an method name <span>Press enter to continue</span>");
	$('.method-preview').html("");
	$("#add-method .form-state").text("0");
	$("#method-textbox").val("");
	$("#method-textbox").attr("placeholder","Start typing");
	$('#method-textbox').unbind('keydown');
	$('#method-textbox').keydown(function(event) {
		if(event.keyCode == 13) {
				
		switch($("#add-method .form-state").text()) {
			case "0":
				$('.method-prompt').html("Enter the method's return type <span>Press enter to continue, esc to cancel</span>");
				the_method.name = $("#method-textbox").val();
				$('.method-preview').append("<div class='name'>"+the_method.name+"</div>");
				$("#add-method .form-state").text("1");
				$("#method-textbox").val("");
				break;
			case "1":
				$('.method-prompt').html("Enter the method's description <span>Press enter to continue, esc to cancel</span>");
				the_method.ret = $("#method-textbox").val();
				$('.method-preview').append("<div class='type'>"+the_method.ret+"</div>");
				$("#add-method .form-state").text("2");
				$("#method-textbox").val("");
				break;
			case "2":
				the_method.description = $("#method-textbox").val();
				var modified_method = the_method;
				modified_method.parent = $("#current-object-id").text();
				modified_method.parent_type = $("#current-object-type").text();
				modified_method.scope = "public";
				modified_method.args = [];
				var data = {
					action : "add",
					type : "method",
					info : modified_method,
					project_id : $("#current-project-id").text()
				}
				console.log(modified_method);
				saveAction(data);
				resetAddMethod();
				break;
		}
			
		}
		if(event.keyCode == 27) {
				resetAddMethod();
		}
	});
}

function classListeners() {
	$(".info .name").unbind('click');
	$('.info .name span').click(function() {
		var _class = $(this).parent().parent();
		var _name = _class.find('.name').text();
		var _desc = _class.find('.description').text().replace('"',"&quot;");
		_class.find('.name').addClass("inputed");
		_class.find('.name').html("<input type='text' class='edit-class-name-"+_name+"' value='"+_name+"'/>");
		_class.find('.description').html('<input class="edit-class-desc-'+_name+'" value="'+_desc+'" />');
		_class.find(".name:first input").focus();
		_class.find('input').keydown(function(event) {
			if(event.keyCode == 13) {
				var n_name =$('.edit-class-name-'+_name).val();
				var n_desc =$('.edit-class-desc-'+_name).val();
				
				var obj_type = $("#current-object-type").text();
				var modified_class = getInterClass($("#current-object-id").text(),obj_type);
				modified_class.name = n_name;
				modified_class.description = n_desc;
				var data = {
					action : "modify",
					type : obj_type,
					info : modified_class,
					project_id : $("#current-project-id").text()
				}
				console.log(data);
				saveAction(data);
			}
		});
		
	});
	
	$(".info .parent").unbind("click");
	$(".info .parent").click(function() {
		
				var modified_class = getInterClass($("#current-object-id").text(),"class");
				modified_class.parents.splice(modified_class.parents.indexOf($(this).text()),1);
				var data = {
					action : "modify",
					type : "class",
					info : modified_class,
					project_id : $("#current-project-id").text()
				}
				console.log(data);
				saveAction(data);
	});
	
	
	$(".info .interface").unbind("click");
	$(".info .interface").click(function() {
		
				var modified_class = getInterClass($("#current-object-id").text(),"class");
				modified_class.interfaces.splice(modified_class.interfaces.indexOf($(this).text()),1);
				var data = {
					action : "modify",
					type : "class",
					info : modified_class,
					project_id : $("#current-project-id").text()
				}
				console.log(data);
				saveAction(data);
	});
	
	$(".info .add-parent").unbind("keydown");
	$(".info .add-parent").keydown(function(event) {
		if(event.keyCode == 13) {
				var modified_class = getInterClass($("#current-object-id").text(),"class");
				modified_class.parents.push($(this).val());
				var data = {
					action : "modify",
					type : "class",
					info : modified_class,
					project_id : $("#current-project-id").text()
				}
				console.log(data);
				saveAction(data);
				update_hierarchy(project);
				$(this).val("");
		}
	});
	
	
	$(".info .add-interface").unbind("keydown");
	$(".info .add-interface").keydown(function(event) {
		if(event.keyCode == 13) {
				var modified_class = getInterClass($("#current-object-id").text(),"class");
				modified_class.interfaces.push($(this).val());
				var data = {
					action : "modify",
					type : "class",
					info : modified_class,
					project_id : $("#current-project-id").text()
				}
				console.log(data);
				saveAction(data);
				$(this).val("");
		}
	});
}

function attributeListeners() {
		$('.attribute .delete').unbind('click');
		$('.attribute .delete').click(function() {
					var modified_obj = getInterClass(
					$('#current-object-id').text(),
					$('#current-object-type').text()
					);
					for(var i in modified_obj.attributes) {
						if(modified_obj.attributes[i].name == $(this).parent().find('.name').text()) {
							modified_obj.attributes.splice(i,1);
						}
					}
					var data = {
						action : "modify",
						type : "class",
						info : modified_obj,
						project_id : $("#current-project-id").text()
					}
					console.log(data);
					saveAction(data);
		});
	
	$('.attribute .name span').unbind('click');
	$('.attribute .name span').click(function() {
		var _attribute = $(this).parent().parent().parent();
		var _name = _attribute.find('.name').text();
		var _type = _attribute.find('.type').text();
		var _desc = _attribute.find('.description').text().replace('"',"&quot;");
		_attribute.find('.name').addClass("inputed");
		_attribute.find('.type').addClass("inputed");
		_attribute.find('.name').html("<input type='text' class='edit-attribute-name-"+_name+"' value='"+_name+"'/>");
		_attribute.find('.type').html("<input type='text' class='edit-attribute-type-"+_name+"' value='"+_type+"'/>");
		_attribute.find('.description').html('<input class="edit-attribute-desc-'+_name+'" value="'+_desc+'" />');
		_attribute.find(".name:first input").focus();
		_attribute.find('input').keydown(function(event) {
			if(event.keyCode == 13) {
				var n_name =$('.edit-attribute-name-'+_name).val();
				var n_type =$('.edit-attribute-type-'+_name).val();
				var n_desc =$('.edit-attribute-desc-'+_name).val();
				
				//_attribute.find('.name').removeClass("inputed");
				//_attribute.find('.type').removeClass("inputed");
				//_attribute.find('.name').html("<span>"+n_name+"</span>");
				//_attribute.find('.type').html(n_type);
				//_attribute.find('.description').html(n_desc);
				var obj_type = $("#current-object-type").text();
				var modified_class = getInterClass($("#current-object-id").text(),obj_type);
				for(var i=0;i<modified_class.attributes.length;i++) {
					if(modified_class.attributes[i].name == _name) {
						modified_class.attributes[i].name = n_name;
						modified_class.attributes[i].type = n_type;
						modified_class.attributes[i].description = n_desc;
					}
				}
				var data = {
					action : "modify",
					type : obj_type,
					info : modified_class,
					project_id : $("#current-project-id").text()
				}
				console.log(data);
				saveAction(data);
			}
		});
		
	});
}
function methodListeners() {
	$('.method').each(function() {
		var the_method = $(this);
			
		the_method.find('.toggle-add-argument').unbind('click');
		the_method.find('.toggle-add-argument').click(function() {
			the_method.find(".add-argument").toggle();
		});
		
		
		the_method.find('.name span').unbind('click');
		the_method.find('.name span').click(function() {
			var _method = the_method;
			var _name = _method.find('.name:first').text();
			var _type = _method.find('.return-type').text();
			var _desc = _method.find('.description:first').text().replace('"',"&quot;");
			_method.find('.name:first').addClass("inputed");
			_method.find('.return-type').addClass("inputed");
			_method.find('.name:first').html("<input type='text' class='edit-method-name-"+_name+"' value='"+_name+"'/>");
			_method.find('.return-type').html("<input type='text' class='edit-method-type-"+_name+"' value='"+_type+"'/>");
			_method.find('.description:first').html('<input class="edit-method-desc-'+_name+'" value="'+_desc+'" />');
			_method.find(".name:first input").focus();
			_method.find('input').keydown(function(event) {
				if(event.keyCode == 13) {
					var n_name = $('.edit-method-name-'+_name).val();
					var n_type = $('.edit-method-type-'+_name).val();
					var n_desc = $('.edit-method-desc-'+_name).val();
									
					_method.find('.name:first').removeClass("inputed");
					_method.find('.return-type').removeClass("inputed");

					//_method.find('.name:first').html("<span>"+n_name+"</span>");
					//_method.find('.return-type').html(n_type);
					//_method.find('.description:first').html(n_desc);
					
					
					var modified_method = getMethod(
					_method.find(".method-id").text(),
					$("#current-object-id").text(),
					$("#current-object-type").text()
					);
					modified_method.name = n_name;
					modified_method.ret = n_type;
					modified_method.description = n_desc;
					var data = {
						action : "modify",
						type : "method",
						info : modified_method,
						project_id : $("#current-project-id").text()
					}
					console.log(data);
					saveAction(data);
				}
			});
			
		});
		
		the_method.find(".delete:first").click(function() {
					var modified_method = getMethod(
					the_method.find(".method-id").text(),
					$("#current-object-id").text(),
					$("#current-object-type").text()
					);
					var data = {
						action : "delete",
						type : "method",
						info : modified_method,
						project_id : $("#current-project-id").text()
					}
					console.log(data);
					saveAction(data);
		});
		
		the_method.find(".argument").each(function() {
			var the_arg = $(this);
			the_arg.find('.delete').unbind('click');
			the_arg.find('.delete').click(function() {
						var modified_method = getMethod(
						the_method.find(".method-id").text(),
						$("#current-object-id").text(),
						$("#current-object-type").text()
						);
						for(var j in modified_method.args) {
							if(modified_method.args[j].name == the_arg.find('.name').text()) {
								modified_method.args.splice(j,1);
							}
						}
						var data = {
							action : "modify",
							type : "method",
							info : modified_method,
							project_id : $("#current-project-id").text()
						}
						console.log(data);
						saveAction(data);
			});
			
			the_arg.find('.name span').unbind('click');
			the_arg.find('.name span').click(function() {
				var _arg = the_arg;
				var _name = _arg.find('.name:first').text();
				var _type = _arg.find('.type').text();
				var _desc = _arg.find('.description:first').text().replace('"',"&quot;");
				_arg.find('.name:first').addClass("inputed");
				_arg.find('.type').addClass("inputed");
				_arg.find('.name:first').html("<input type='text' class='edit-arg-name-"+_name+"' value='"+_name+"'/>");
				_arg.find('.type').html("<input type='text' class='edit-arg-type-"+_name+"' value='"+_type+"'/>");
				_arg.find('.description:first').html('<input class="edit-arg-desc-'+_name+'" value="'+_desc+'" />');
				_arg.find(".name:first input").focus();
				_arg.find('input').keydown(function(event) {
					if(event.keyCode == 13) {
						var n_name = $('.edit-arg-name-'+_name).val();
						var n_type = $('.edit-arg-type-'+_name).val();
						var n_desc = $('.edit-arg-desc-'+_name).val();
										
						_arg.find('.name:first').removeClass("inputed");
						_arg.find('.return-type').removeClass("inputed");

						//_arg.find('.name:first').html("<span>"+n_name+"</span>");
						//_arg.find('.return-type').html(n_type);
						//_arg.find('.description:first').html(n_desc);
						
						
						var modified_method = getMethod(
						the_method.find(".method-id").text(),
						$("#current-object-id").text(),
						$("#current-object-type").text()
						);
						for(var j in modified_method.args) {
							if(modified_method.args[j].name == _name) {
								modified_method.args[j].name = n_name;
								modified_method.args[j].attr_type = n_type;
								modified_method.args[j].description = n_desc;
							}
						}
						var data = {
							action : "modify",
							type : "method",
							info : modified_method,
							project_id : $("#current-project-id").text()
						}
						console.log(data);
						saveAction(data);
					}
				});
				
			});
		});
		
		resetAddArgument(the_method);
		
	});
}
