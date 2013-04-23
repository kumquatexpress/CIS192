(function() {
  app.util = app.util || {};
  app.util.data = app.util.data || {};
  app.sample_data = {
    id : "1",
    name : "My Project",
    description : "It's a frickin awesome project",
    classes : [
    {
      id : "2",
      name : "Comment",
      project : "1",
      description : "It's a class for comments",
      parents : ["DBObj"],
      interfaces : ["Commentable","Likeable"],
      attributes : [
      {scope : "private", name : "id", attr_type : "int", description : "The DB id."},
      {scope : "private", name : "comment", attr_type : "string", description : "The comment"}
      ],
      methods : [
      {
        id :  "1",
        scope : "public",
        name : "like",
        description : "testing",
        parent : "1",
        parent_type : "class",
        ret : "void",
        arguments : [
        {name : "user", attr_type : "User", description : "The user liking it"},
        {name : "timestamp", attr_type : "long", description : "The UNIX timestamp"}
        ]
      }
      ]
    },
    {
      id: "4",
      name: "Hello World",
      project: "1",
      description: "hi",
      parents: ["Comment"],
      interfaces: ["Commentable"],
      attributes : [],
      methods : []
    }
    ],
    interfaces : [
    {
      id : "1",
      name : "Commentable",
      project : "1",
      description : "Interface for things that are commentable",
      attributes : [
      {scope : "private", name : "other_id", attr_type : "int", description : "The other id."},
      {scope : "private", name : "details", attr_type : "string", description : "Some details."}
      ],
      methods : [
      {
        id :  "1",
        scope : "public",
        name : "addComment",
        parent : "1",	
        parent_type : "interface",
        ret : "boolean",
        arguments : [
        {name : "comment", attr_type : "string", description : "The comment to add"},
        {name : "user", attr_type : "User", description : "The user commenting."}
        ]
      }
      ]
    }
    ]
  };

  function find_class(cls, class_id) {
    var ret_class;
    _.each(cls, function(c){
      if(c.id === parseInt(class_id)) {
        ret_class = ret_class || c;
        return;
      }
      // if it contains a classes thats not empty
      if(c.children && c.children.length > 0) {
        ret_class = ret_class || find_class(c.children, class_id);
      }
    });
    return ret_class;
  }

  app.util.data.getInterClass = function(class_id,type) {
    console.log('inside getinterclass')
    console.log(project)
    if(type == "class") {		
      return find_class(project.classes, class_id);
      // for(var i=0;i<project.classes.length;i++) {
      //   if(project.classes[i].id == class_id) {
      //     return project.classes[i];
      //   }
      // }
    }
    else if(type == "interface") {
      console.log('LOOKING FOR AN INTERFACE. SOMETHING WRONG! SHOULD NOT HAVE REACHED HERE!!')
      for(var i=0;i<project.interfaces.length;i++) {
        if(project.interfaces[i].id == class_id) {
          return project.interfaces[i];
        }
      }
    }
  };

  app.util.data.getMethod = function(method_id,parent_id,parent_type) {
    if(parent_type == "class") {
      for(var i=0;i<project.classes.length;i++) {
        if(project.classes[i].id == parent_id) {
          var methods = project.classes[i].methods;
          for(var j=0;j<methods.length;j++) {
            if(methods[j].id == method_id) {
              return methods[j];
            }
          }
        }
      }
    }
    else if(parent_type == "interface") {
      for(var i=0;i<project.interfaces.length;i++) {
        if(project.interfaces[i].id == parent_id) {
          var methods = project.interfaces[i].methods;
          for(var j=0;j<methods.length;j++) {
            if(methods[j].id == method_id) {
              return methods[j];
            }
          }
        }
      }
    }
  };

})();
