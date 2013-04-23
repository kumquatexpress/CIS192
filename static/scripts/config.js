var app = {
  util: {},
  display: {}
};

var project = null;

$(document).ready(function() {
  $.post("/projects/"+project_id,{},function(data) {
      project = $.parseJSON(data); 
      console.log('Raw data: ');
      console.log(data);
      console.log('New JSON data: ');
      console.log(project);

      app.util.details.loadProjectDetail();
      app.util.generate_hierarchy('hierarchy-wrapper', project);
      console.log(project);
      detailListeners();
      $(".edit-object").hide();
  });

  $(".back").click(function() {
      app.util.details.loadProjectDetail();
  });

  sockets.init(project_id);
  detailListeners();
  $(".edit-object").hide();

  $(".back").click(function(){
    app.util.details.loadProjectDetail();
  });

  console.log(app)
});


