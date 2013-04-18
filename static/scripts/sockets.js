(function(sockets, $, undefined){
	var ws = null;
	sockets.init = function() {
		ws = new WebSocket("ws://localhost:8080/ws");
		ws.onopen = function() {
			console.log("WebSocket opened.");
		};
		ws.onmessage = function(evt) {
			console.log(evt.data);
			data = $.parseJSON(evt.data);
			if(data.tag == "update") {
				processAction(data.data);
			}
		};
		ws.onerror = function(evt) {
			console.log("WebSocket error occured: " + evt.data);

		};
	};

}(window.sockets = window.sockets || {}, jQuery));
/*
var socket = io.connect("/");

socket.on('update', function(data){
  console.log(data);
	processAction(data);
});
socket.on('add_method', function(data){
  tmp_methods.push(data);
});*/


function saveAction(action_obj) {
  console.log(action_obj);
	//socket.emit('saveAction', action_obj);
  console.log('save action done');
  processAction(action_obj);
}
function processAction(action_obj) {
	switch(action_obj.type) {
		case "class":
			if(action_obj.action == "add") {
				addClass(action_obj.info);
			}
			else if(action_obj.action == "modify") {
				modifyClass(action_obj.info);
			}
			else if(action_obj.action == "delete") {
				deleteClass(action_obj.info);
			}
		break;
		case "interface":
			if(action_obj.action == "add") {
				addInterface(action_obj.info);
			}
			else if(action_obj.action == "modify") {
				modifyInterface(action_obj.info);
			}
			else if(action_obj.action == "delete") {
				deleteInterface(action_obj.info);
			}
		break;
		case "method":
			if(action_obj.action == "add") {
				addMethod(action_obj.info);
			}
			else if(action_obj.action == "modify") {
				modifyMethod(action_obj.info);
			}
			else if(action_obj.action == "delete") {
				deleteMethod(action_obj.info);
			}
		break;
	}
}
var example = {
	action : "modify",
	type : "method",
	info : {
		id : "15adfdsf",
		name : "asdfasdf"
		},
	project_id : "1244asdf"
};
