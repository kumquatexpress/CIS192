var app = {
  util: {}
  };


var project = null;
var me = 'AnonymousUser' + parseInt(Math.random() * 10000);

$(document).ready(function() {
  $.ajax({
  method : "GET",
  url : 'data.json',//"/projects/"+project_id+".json",
  success : function(data) {
   project = data; 
   if(!project.classes) project.classes = [];
   for(var i in project.classes) {
     project.classes[i].methods = [];
   }
   if(!project.interfaces) project.interfaces = [];
   for(var i in project.interfaces) {
     project.interfaces[i].methods = [];
   }
   app.util.details.loadProjectDetail();
   $.ajax({
     method : "GET",
     url : 'data.json' // "/methods/"+project_id+".json",
     success : function(data) {
         for(var i in data) {
           processAction({ action : "add", type :"method",info : data[i] });
         }
       }
     });
   console.log(project);
   // socket.emit('openProject',{ project_id: project.id });
  }
  });
  detailListeners();
  $(".edit-object").hide();
  /* chat */


  function sendMessage(){
    var message = $('#chatbox input').val();
    if(message === '') return;
    $('#chatbox input').val('');
    console.log(message);
    // socket.emit('chat', {
    //   username: me,
    //   message: message
    // });
  }

  // chat username
  $('#chat-username').keypress(function(keycode){
    if(keycode.keyCode === 13){
      me = $('#chat-username').val();
      $('#chat-username').val('');
    }
  });

  // socket.on('chat', function(data){
  //   var new_msg = $('#messages p').first().clone();
  //   new_msg.find('.user').text(data.username);
  //   new_msg.find('.message').text(data.message);
  //   new_msg.appendTo('#messages');
  //   $('#messages').stop().animate({scrollTop: $('#messages').prop('scrollHeight')});
  // });

  
  $('#chatbox input').keydown(function (event){
    if (!event) { event = window.event; }
    if(event.keyCode === 13 ) {
      sendMessage();
      $('#game').focus();
    }
  });

  $(".back").click(function(){
    app.util.details.loadProjectDetail();
  });

  console.log(app)


  // // SOCKET STUFF # PATRICK
  //   app.util.details.loadProjectDetail();
  //   console.log(project);
  //   detailListeners();
  //   $(".edit-object").hide();
  //   app.util.loadClassDetail(2);

  //   $(".back").click(function() {
  //       app.util.details.loadProjectDetail();
  //   });
  //   sockets.init("1");

});


