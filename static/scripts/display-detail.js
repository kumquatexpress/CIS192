(function() {
  app.util = app.util || {};
  app.util.details = app.util.details || {};

  app.util.details.loadProjectDetail = function() {
    $("#current-project-id").text(project.id);
    $(".project-info .project_title").text(project.name);
    $(".project-info .description").text(project.description);
    $(".add-attributes").css("display", "none");
    $(".add-methods").css("display", "none");
    app.util.generate_hierarchy("hierarchy-wrapper", project);
  };

  function find_class(cls, class_id) {
    var ret_class;
    _.each(cls, function(c) {
      if (c.id === parseInt(class_id)) {
        ret_class = c;
        return;
      }
      // if it contains a classes thats not empty
      if (c.children && c.children.length > 0) {
        ret_class = find_class(c.children, class_id);
      }
    });
    return ret_class;
  }

  app.util.details.loadClassDetail = function(class_id) {
    var the_class;

    console.log(project.classes)
    the_class = find_class(project.classes, class_id);
    console.log('the_class')
    console.log(the_class);
    if (the_class) {
      $("#current-object-type").text("class");
      $("#current-object-id").text(the_class.id);
      app.util.details.loadObjectDetail(the_class);
      update_codeview(the_class, project.interfaces, "class", "java");
    } else console.log('error, could not find class')
  };

  app.util.details.loadInterfaceDetail = function(interface_id) {
    var the_interface;
    for (var i in project.interfaces) {
      if (project.interfaces[i].id == interface_id) {
        the_interface = project.interfaces[i];
        $("#current-object-type").text("interface");
        $("#current-object-id").text(the_interface.id);
        app.util.details.loadObjectDetail(the_interface);
      }
    }
    update_codeview(the_interface, project.interfaces, "class", "java");
  };

  app.util.details.loadObjectDetail = function(the_obj) {
    app.util.details.loadObjInfoDetail(the_obj);
    app.util.details.loadMethodsDetail(the_obj);
    resetAddAttribute();
    resetAddMethod();
    $(".edit-object").show();
    $(".add-attributes").css("display", "inline");
    $(".add-methods").css("display", "inline");
  };

  app.util.details.loadObjInfoDetail = function(the_obj) {
    console.log('inside loadobjinfodetail');
    console.log(the_obj);
    var edit_obj = $(".edit-object");
    edit_obj.attr("id", "edit-object-" + the_obj.id);
    edit_obj.find(".info .name").html("<span>" + the_obj.name + "</span>");
    edit_obj.find(".info .description").text(the_obj.description);
    var rels = edit_obj.find(".info .relations");
    rels.html("");
    // check parents, only if the have a project_id
    for (var i in the_obj.parents) {
      if (the_obj.parents[i].project_id) rels.append('<div class="parent">' + the_obj.parents[i].name + '</div>');
    }
    rels.append('<input class="add-parent" type="text" placeholder="ParentClass"/>');
    var attrs = edit_obj.find(".attributes");
    attrs.html("<h3>Attributes</h3");
    for (var j in the_obj.attributes) {
      var the_attr = the_obj.attributes[j];
      attrs.append('<div class="attribute">' +
        '<div class="vital-info">' +
        '<div class="scope">' + the_attr.scope + '</div>' +
        '<div class="name"><span>' + the_attr.name + '</span></div>' +
        '<div class="type">' + the_attr.attr_type + '</div>' +
        //'<div id="delete-attribute-' + the_attr.name + '" class="delete">Delete</div>' +
        '</div>' +
        '<div class="description">' + the_attr.description + '</div>' +
        '</div>');
    }
    classListeners();
    attributeListeners();
  };

  app.util.details.loadMethodsDetail = function(the_obj) {
    var edit_obj = $(".edit-object");

    var meths = edit_obj.find(".methods");
    meths.html("<h3>Methods</h3>");
    for (var j in the_obj.methods) {
      var the_method = the_obj.methods[j];
      meths.append('<div class="method">' +
        '<div class="vital-info">' +
        '<div class="scope">' + the_method.scope + '</div>' +
        '<div class="name"><span>' + the_method.name + '</span></div>' +
        '<div class="return-type">' + the_method.ret + '</div>' +
        //'<div id="delete-method-' + the_method.id + '" class="delete">Delete</div>' +
        '</div>' +
        '<div class="description">' + the_method.description + '</div>' +
        '<div class="arguments"></div>' +
        '</div>');
      var arguments = meths.find('.method:last .arguments');
      for (var k in the_method.arguments) {
        var the_arg = the_method.arguments[k];
        arguments.append('<div class="argument">' +
          '<div class="vital-info">' +
          '<div class="name"><span>' + the_arg.name + '</span></div>' +
          '<div class="type">' + the_arg.attr_type + '</div>' +
          '<div class="description">' + the_arg.description + '</div>' +
          //'<div id="delete-argument-' + the_arg.name + '" class="delete">Delete</div>' +
          '</div>' +
          '</div>');
      }
      arguments.append('<div class="toggle-add-argument">Add Argument</div>');
      arguments.append('<div class="add-argument">' +
        '<div class="method-id">' + the_method.id + '</div>' +
        '<div class="form-state">0</div>' +
        '<div class="argument-prompt prompt"></div>' +
        '<div class="argument-preview preview"></div>' +
        '<div class="argument-form">' +
        '<input class="argument-textbox" type="text" />' +
        '</div>' +
        '</div>');
    }

    methodListeners();
  };


  app.util.details.modifyClassDetail = function(class_obj) {

  };

})();