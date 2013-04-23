(function() {
  app.util = app.util || {};
  app.util.display = app.util.display || {};

  function find_class(cls, class_id) {
    var ret_class;
    _.each(cls, function(c){
      if(c.id === parseInt(class_id)) {
        ret_class = c;
        return;
      }
      // if it contains a classes thats not empty
      if(c.children && c.children.length > 0) {
        ret_class = find_class(c.children, class_id);
      }
    });
    return ret_class;
  }

  app.util.display.addClass = function(info_obj) {
    if (!info_obj.attributes) {
      info_obj.attributes = [];
    }
    if (!info_obj.methods) {
      info_obj.methods = [];
    }
    project.classes.push(info_obj);
    //update_hierarchy(project);
    console.log("CALLING GENERATE HIERARCHY");
    console.log(project);
    var flag = false;
    if($(".edit-object").css("display") != "none") {
      flag = true;
    }
    app.util.details.loadProjectDetail();
    if(flag) {

          $('.the-code').toggle();
          $('#hierarchy-wrapper').toggle();
          update_codeview(find_class(project.classes, parseInt($('#current-object-id').text())), project.interfaces, "class")
          app.util.details.loadObjectDetail(find_class(project.classes, parseInt($('#current-object-id').text())))
  
    }
  };
  
  app.util.display.modifyClass = function(info_obj) {
    //Update the project object
    var the_obj = null;
    for (var i in project.classes) {
      var the_class = project.classes[i];
      if (the_class.id == info_obj.id) {
        the_class.name = info_obj.name;
        the_class.descripton = info_obj.description;
        the_class.attributes = info_obj.attributes;
        // the_class.parent = info_obj.parent;
        the_class.interfaces = info_obj.interfaces;
        the_obj = the_class;
      }
    }
    if (the_obj) {
      //Update the detail panel if necessary
      if(the_obj.id == $("#current-object-id").text()) {
        app.util.details.loadObjInfoDetail(the_obj);
      }
      //Update the code view if necessary
      if (the_obj.id == $("#current-object-id").text()) {
        update_codeview(the_obj, project.interfaces, "class")
      }
  
      //Update the heierachical view if necessary
    }
  };
  
  app.util.display.deleteClass = function(info_obj) {
  
  };
  
  app.util.display.addInterface = function(info_obj) {
    project.interfaces.push(info_obj);
    app.util.details.loadInterfaceDetail(info_obj.id);
    update_hierarchy(project);
  };
  
  app.util.display.modifyInterface = function(info_obj) {
    //Update the project object
    var the_obj = null;
    for (var i in project.interfaces) {
      var the_interface = project.interfaces[i];
      if (the_interface.id == info_obj.id) {
        the_interface.name = info_obj.name;
        the_interface.descripton = info_obj.description;
        the_interface.attributes = info_obj.attributes;
        // the_interface.parent = info_obj.parent;
        the_interface.interfaces = info_obj.interfaces;
        the_obj = the_interface;
      }
    }
    if (the_obj) {
      //Update the detail panel if necessary
      if($("#current-object-type").text() == "interface" && 
      the_obj.id == $("#current-object-id").text()) {
        app.util.details.loadObjInfoDetail(the_obj);
      }
      //Update the code view if necessary
      //Update the heierachical view if necessary
    }
  };
  
  app.util.display.deleteInterface = function(info_obj) {
  
  };
  
  app.util.display.addMethod = function(info_obj) {
    //Update the project object
    var the_obj = null;
    console.log('here')
    console.log(info_obj)
    if (info_obj.parent_type != "interface") {
      
      the_obj = find_class(project.classes, info_obj.class_id)

      the_obj.methods.push(info_obj);
      // for (var i in project.classes) {
      //   var the_class = project.classes[i];
      //   if (the_class.id == info_obj.parent) {
      //     the_class.methods.push(info_obj);
      //     the_obj = the_class;
      //   }
      // }
      update_codeview(the_obj, project.interfaces, "class");
    } else {
      for (var i in project.interfaces) {
        var the_interface = project.interfaces[i];
        if (the_interface.id == info_obj.parent) {
          the_interface.methods.push(info_obj);
          the_obj = the_interface;
        }
      }
      update_codeview(the_obj, project.interfaces, "interface");
    }
    if(the_obj) {
      if($("#current-object-id").text() == the_obj.id) {
        app.util.details.loadMethodsDetail(the_obj);
      }
    }
  };
  
  app.util.display.modifyMethod = function(info_obj) {
    var the_obj = null;
    for (var i in project.classes) {
      var the_class = project.classes[i];
      if (the_class.id == info_obj.class_id) {
        for (var j in the_class.methods) {
          var the_method = the_class.methods[j];
          if (the_method.id == info_obj.id) {
            the_method.name = info_obj.name;
            the_method.ret = info_obj.ret;
            the_method.arguments = info_obj.arguments;
            the_method.scope = info_obj.scope;
            the_method.description = info_obj.description;
          }
        }
        the_obj = the_class;
        update_codeview(the_obj, project.interfaces, "class");
      }
    }
    if(the_obj) {
      if($("#current-object-id").text() == the_obj.id) {
        app.util.details.loadMethodsDetail(the_obj);
      }
    }
  };
  
  app.util.display.deleteMethod = function(info_obj) {
    var the_obj = null;
    if (info_obj.parent_type != "interface") {
      for (var i in project.classes) {
        var the_class = project.classes[i];
        if (the_class.id == info_obj.parent) {
          for (var j in the_class.methods) {
            var the_method = the_class.methods[j];
            if (the_method.id == info_obj.id) {
              the_class.methods.splice(j, 1);
            }
          }
          the_obj = the_class;
        }
      }
    } else {
      for (var i in project.interfaces) {
        var the_interface = project.interfaces[i];
        if (the_interface.id == info_obj.parent) {
          for (var j in the_interface.methods) {
            var the_method = the_interface.methods[j];
            if (the_method.id == info_obj.id) {
              the_interface.methods.splice(j, 1);
            }
          }
          the_obj = the_interface;
        }
      }
    }
    if(the_obj) {
      if($("#current-object-id").text() == the_obj.id) {
        app.util.details.loadMethodsDetail(the_obj);
      }
    }
  };
})();
