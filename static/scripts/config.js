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
                
            ],
            "name": "classC",
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
            "id": 3,
            "description": "classCisaseparateclassfromAandB"
        }
    ],
    "id": 1,
    "name": "testProj"
}

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


