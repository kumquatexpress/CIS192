var attr = new Object()
attr.name = "id"
attr.scope = "private"
attr.type = "int"
attr.description = "The Id in the database"

var obj = new Object()
obj.name = "class1"
obj.id = "1234567"
obj.project = "asdf"
obj.description = "Hey look at me"
obj.parent = "Comparable"
obj.attributes = [attr]

var bigjson = new Object()
bigjson.class = obj

var json_string = JSON.stringify(bigjson)