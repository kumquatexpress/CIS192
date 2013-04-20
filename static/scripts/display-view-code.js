var lang = "java";

function update_codeview(_class, _interfaces, flag)
{
  var theskelton;
	if(lang == "java")
	{
    console.log('hihihihihi');
    console.log(_class);
    console.log(_interfaces);
		theskeleton = java_skeleton(_class, _interfaces, flag);
    
	}
	if(lang == "ruby")
	{
		theskeleton = ruby_skeleton(_class, _interfaces, flag);
	}
	if(lang == "python")
	{
		theskeleton = python_skeleton(_class, _interfaces, flag);	
	}
	var bigstring = "<pre><code>" + 
		hljs.highlightAuto(theskeleton.code).value + 
		"</code></pre>";
	var warning_string = "";
	var _allwarnings = [];
	if(theskeleton.warnings[0])
	{
		for(var warn in theskeleton.warnings)
		{
			_allwarnings.push(theskeleton.warnings[warn]);
		}
		warning_string = "Warnings: " + _allwarnings.join("\n\n");
	}
	$('.the-code').html(bigstring);
	$('.warnings-panel').html(warning_string);
}

function changeLanguage()
{
	lang = $('#language').val();
	var the_class = app.util.getInterClass($("#current-object-id").text(),$("#current-object-type").text());
	update_codeview(the_class,project.interfaces,$("#current-object-type").text());
}
