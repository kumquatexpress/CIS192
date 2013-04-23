(function(sockets, $, undefined) {
	var ws = null;
	sockets.init = function(proj_id) {
		ws = new WebSocket("ws://localhost:8080/ws");
		ws.onopen = function() {
			console.log("WebSocket opened.");
			handshake = {
				"project_id": proj_id
			};
			ws.send(JSON.stringify(handshake));
		};
		ws.onmessage = function(evt) {
			console.log('receivved message')
			console.log(evt.data);
			data = $.parseJSON(evt.data);
			if (data.tag == "update") {
				sockets.processAction(data.data);
			}
		};
		ws.onerror = function(evt) {
			console.log("WebSocket error occured: " + evt.data);
		};
	};

	function clear_parent(obj) {
		// remove all parent attributes
		obj.parent = undefined;
		obj.parents = undefined;
		_.each(obj.children, function(item) {
			item.parent = undefined;
			item.parents = undefined;
			if (item.children && item.children.length > 0) {
				item.children = clear_parent(item.children);
			}
		});
		return obj;
	}

	sockets.saveAction = function(action_obj) {
		console.log("Saving object : " + action_obj);
		console.log(action_obj)
		var obj_no_par = action_obj;
		obj_no_par.info = clear_parent(obj_no_par.info)
		console.log(obj_no_par)

		ws.send(JSON.stringify(obj_no_par));
		console.log('Finished saving action.');
	};

	var example_action_obj = {
		action: "modify",
		type: "method",
		info: {
			id: "15adfdsf",
			name: "asdfasdf"
		},
		project_id: "1244asdf"
	};

	sockets.processAction = function(action_obj) {
		console.log('inside process action')
		switch (action_obj.type) {
			case "class":
				if (action_obj.action == "add") {
					app.util.display.addClass(action_obj.info);
				} else if (action_obj.action == "modify") {
					app.util.display.modifyClass(action_obj.info);
				} else if (action_obj.action == "delete") {
					app.util.display.deleteClass(action_obj.info);
				} else if (action_obj.action == "inherit") {
					//@TODO What needs to be done for inheritance?

					//           var find_class_inheritance = function(cls, class_id, replacer) {
					//             var ret_class;
					//             _.each(cls, function(c, index){
					//               if(c.id === parseInt(class_id)) {
					//                 ret_class = c;
					//                 cls[index] = replacer;
					//                 // replace it
					//                 return;
					//               }
					//               // if it contains a classes thats not empty
					//               if(c.children && c.children.length > 0) {
					//                 ret_class = find_class_inheritance(c.children, class_id);
					//               }
					//             });
					//             return ret_class;
					//           };

					//           var remove_class = function(cls, class_id) {
					//             var ret_class;
					//             _.each(cls, function(c, index){
					//               if(c.id === parseInt(class_id)) {
					//                 ret_class = c;
					//                 delete cls[index];
					//                 // replace it
					//                 return;
					//               }
					//               // if it contains a classes thats not empty
					//               if(c.children && c.children.length > 0) {
					//                 ret_class = find_class_inheritance(c.children, class_id);
					//               }
					//             });
					//             return ret_class;
					//           }


					// console.log('hihihihihihih here')
					// console.log(action_obj)

					//           var temp1 = remove_class(project.classes, parseInt($('#current-object-id').text()));
					//           var temp2 = remove_class(project.children, parseInt($('#current-object-id').text()));
					//           temp1.parents.push(action_obj.info)
					//           temp2.parents.push(action_obj.info)

					//           find_class_inheritance(project.classes, action_obj.info.id, action_obj.info);
					//           find_class_inheritance(project.children, action_obj.info.id, action_obj.info);
					//           // re_node(project.classes);
					//           // Replace new instance of class with old instance, plus the parent
					//           find_class_inheritance(project.classes,  parseInt($('#current-object-id').text()), temp1);
					//           find_class_inheritance(project.classes,  parseInt($('#current-object-id').text()), temp2);

					//           console.log('renoding!!!')
					//           console.log(project.classes)

					//           app.util.details.loadClassDetail(parseInt($('#current-object-id').text()));
					//
					//
					//
					//

					function find_class(cls, class_id) {
						var ret_class;
						_.each(cls, function(c) {
							if (c.id === parseInt(class_id)) {
								ret_class = ret_class || c;
								return;
							}
							// if it contains a classes thats not empty
							if (c.children && c.children.length > 0) {
								ret_class = ret_class || find_class(c.children, class_id);
							}
						});
						return ret_class;
					}

					project = action_obj.info;

					var flag = false;
					if ($(".edit-object").css("display") != "none") {
						flag = true;
					}
					app.util.details.loadProjectDetail();
					if (flag) {

						$('.the-code').toggle();
						$('#hierarchy-wrapper').toggle();
						update_codeview(find_class(project.classes, parseInt($('#current-object-id').text())), project.interfaces, "class")
						app.util.details.loadObjectDetail(find_class(project.classes, parseInt($('#current-object-id').text())))

					}
				}
				break;
			case "interface":
				if (action_obj.action == "add") {
					app.util.display.addInterface(action_obj.info);
				} else if (action_obj.action == "modify") {
					app.util.display.modifyInterface(action_obj.info);
				} else if (action_obj.action == "delete") {
					app.util.display.deleteInterface(action_obj.info);
				}
				break;
			case "method":
				if (action_obj.action == "add") {
					app.util.display.addMethod(action_obj.info);
				} else if (action_obj.action == "modify") {
					app.util.display.modifyMethod(action_obj.info);
				} else if (action_obj.action == "delete") {
					app.util.display.deleteMethod(action_obj.info);
				}
				break;
		}
	};

}(window.sockets = window.sockets || {}, jQuery));
