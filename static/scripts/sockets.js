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

	sockets.saveAction = function(action_obj) {
		console.log("Saving object : " + action_obj);
    console.log(action_obj)
		ws.send(JSON.stringify(action_obj));
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
					addClass(action_obj.info);
				} else if (action_obj.action == "modify") {
					modifyClass(action_obj.info);
				} else if (action_obj.action == "delete") {
					deleteClass(action_obj.info);
				}
				break;
			case "interface":
				if (action_obj.action == "add") {
					addInterface(action_obj.info);
				} else if (action_obj.action == "modify") {
					modifyInterface(action_obj.info);
				} else if (action_obj.action == "delete") {
					deleteInterface(action_obj.info);
				}
				break;
			case "method":
				if (action_obj.action == "add") {
					addMethod(action_obj.info);
				} else if (action_obj.action == "modify") {
					modifyMethod(action_obj.info);
				} else if (action_obj.action == "delete") {
					deleteMethod(action_obj.info);
				}
				break;
		}
	};

}(window.sockets = window.sockets || {}, jQuery));
