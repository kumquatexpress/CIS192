(function() {
  app.util = app.util || {};
  app.util.display = app.util.display || {};


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
    app.util.generate_hierarchy('hierarchy-wrapper', project);
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
    if (info_obj.parent_type != "interface") {
      for (var i in project.classes) {
        var the_class = project.classes[i];
        if (the_class.id == info_obj.parent) {
          the_class.methods.push(info_obj);
          the_obj = the_class;
        }
      }
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
    if (info_obj.parent_type != "interface") {
      for (var i in project.classes) {
        var the_class = project.classes[i];
        if (the_class.id == info_obj.parent) {
          for (var j in the_class.methods) {
            var the_method = the_class.methods[j];
            if (the_method.id == info_obj.id) {
              the_method.name = info_obj.name;
              the_method.ret = info_obj.ret;
              the_method.args = info_obj.args;
              the_method.scope = info_obj.scope;
              the_method.description = info_obj.description;
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
              the_method.name = info_obj.name;
              the_method.ret = info_obj.ret;
              the_method.args = info_obj.args;
              the_method.scope = info_obj.scope;
              the_method.description = info_obj.description;
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
