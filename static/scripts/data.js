(function() {
  app.util = app.util || {};
  app.util.data = app.util.data || {};

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
    obj_class = find_class(project.classes, parent_id);
    var methods = obj_class.methods;
    for(var j=0;j<methods.length;j++) {
      if(methods[j].id == method_id) {
        return methods[j];
      }
    }
  };

})();
