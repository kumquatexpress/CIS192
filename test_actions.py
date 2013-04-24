import class_models as models
import nose

models.test_session()

p = models.new_project("testproj", "testdesc")  # test project
cid = models.new_class("testc", "testdesc", p.id)  # test class
c = models.db.query(models.Class).filter(models.Class.id == cid).first()


def test_create_project():
    name = "test"
    desc = "this is a test"
    p = models.new_project(name, desc)
    assert p.description == desc and p.name == name and p.id is not None


def test_update_project():
    newname = "newtest"
    newdesc = "this is a new description"
    n = models.new_project(newname, newdesc, p.id)
    assert n.description == newdesc and n.name == newname and n.id is not None


def test_create_class():
    name = "testclass"
    desc = "this is a test class"
    n = models.new_class(name, desc, p.id)
    assert n is not None


def test_update_class():
    name = "withattrs"
    desc = "should now have attrs"
    attrs = [{'name': "testattr", 'scope': "public", 'attr_type': "string",
              'description': "this is a test attr"}]
    models.new_class(name, desc, p.id, attributes=attrs, id=c.id)
    assert c.attributes is not [] and c.description == desc


def test_create_method():
    name = "testmethod"
    desc = "this is a test method"
    scope = "public"
    ret = "void"
    m = models.new_method(name, scope, ret, desc, c.id)
    assert m['id'] is not None and m['name'] == name


def test_create_child():
    name = "childclass"
    desc = "should be child of class c"
    d = models.db.query(models.Class).filter(models.Class.id == models.new_class(name, desc, p.id)).first()
    models.add_child(d.id, c.name)
    assert d in c.children and c in d.parents
