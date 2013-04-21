import class_models as mods

p = mods.Project("testProj", "awesome project")

c = mods.Class("testA", "testA is parent of B")
c.project_id = 1

d = mods.Class("testB", "testB is child of A")
d.project_id = 1
d.parents.append(c)

e = mods.Class("testC", "testC is another class on the toplevel")
e.project_id = 1

m = mods.Method("methodA", "public", "void", "method A is in classA")
m.class_id = 1

db = mods.make_session()
db.add_all([p, c, d, e, m])
db.commit()
