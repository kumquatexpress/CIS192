var app = {
  util: {},
  display: {}
};

sample_dat = {
    "description": "thisisatest",
    "classes": [
        {
            "methods": [
                {
                    "description": "methodforclassA",
                    "class_id": 1,
                    "ret": "void",
                    "arguments": [
                        
                    ],
                    "scope": "public",
                    "id": 1,
                    "name": "methodA"
                },
                {
                    "description": "methodforclassB",
                    "class_id": 1,
                    "ret": "string",
                    "arguments": [
                        
                    ],
                    "scope": "private",
                    "id": 2,
                    "name": "methodB"
                }
            ],
            "name": "testClass",
            "attributes": [
                
            ],
            "abstract": "False",
            "project_id": 1,
            "children": [
                {
                    "methods": [
                        {
                            "description": "justkiddingmethodBwaspartofclassA",
                            "class_id": 2,
                            "ret": "void",
                            "arguments": [
                                
                            ],
                            "scope": "protected",
                            "id": 3,
                            "name": "methodrealB"
                        }
                    ],
                    "name": "child",
                    "attributes": [
                        
                    ],
                    "abstract": "False",
                    "project_id": 1,
                    "children": [
                        
                    ],
                    "id": 2,
                    "description": "thisisachildclass"
                }
            ],
            "id": 1,
            "description": "0"
        },
        {
            "methods": [
                {
                    "description": "justkiddingmethodBwaspartofclassA",
                    "class_id": 2,
                    "ret": "void",
                    "arguments": [
                        
                    ],
                    "scope": "protected",
                    "id": 3,
                    "name": "methodrealB"
                }
            ],
            "name": "child",
            "attributes": [
                
            ],
            "abstract": "False",
            "project_id": 1,
            "children": [
                
            ],
            "id": 2,
            "description": "thisisachildclass"
        },
        {
            "methods": [
                
            ],
            "name": "classC",
            "attributes": [
                
            ],
            "abstract": "False",
            "project_id": 1,
            "children": [
                
            ],
            "id": 3,
            "description": "classCisaseparateclassfromAandB"
        }
    ],
    "id": 1,
    "name": "testProj"
}

var project = null;
var me = 'AnonymousUser' + parseInt(Math.random() * 10000);

$(document).ready(function() {
  console.log('hoihwaiueh');
  $.ajax({
    method : "GET",
    url : 'sample_data',//"/projects/"+project_id+".json",
    success : function(data) {
      project = sample_dat; 
      console.log('insideeeee');
      console.log(data);
      console.log('projeect');
      console.log(project);
      if(!project.classes) project.classes = [];
      for(var i in project.classes) {
        project.classes[i].methods = [];
      }
      if(!project.interfaces) project.interfaces = [];
      for(var i in project.interfaces) {
        project.interfaces[i].methods = [];
      }
      // stuff
      // app.util.details.loadProjectDetail();
      $.ajax({
        method : "GET",
        url : 'static/testdata.json', // "/methods/"+project_id+".json",
        success : function(data) {
          for(var i in data) {
            sockets.processAction({ action : "add", type :"method",info : data[i] });
          }
        }
      });
      console.log('project:');
      console.log(project);

      // app.util.details.loadProjectDetail();
      app.util.generate_hierarchy('hierarchy-wrapper', project);
      console.log(project);
      detailListeners();
      $(".edit-object").hide();
      // loadClassDetail(2);

      // socket.emit('openProject',{ project_id: project.id });
    }
  });
  $(".back").click(function() {
      loadProjectDetail();
  });

  sockets.init("1");
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


