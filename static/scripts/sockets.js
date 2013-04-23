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
		_.each(obj.children, function(item) {
			item.parent = undefined;
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
		switch (action_obj.type) {
			case "class":
				if (action_obj.action == "add") {
					app.util.display.addClass(action_obj.info);
				} else if (action_obj.action == "modify") {
					app.util.display.modifyClass(action_obj.info);
				} else if (action_obj.action == "delete") {
					app.util.display.deleteClass(action_obj.info);
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