from sqlalchemy import Column, Table, Integer, String, create_engine, ForeignKey
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref, sessionmaker
import json

engine = create_engine('mysql://codify@cis330.ca9iefbk06km.us-east-1.rds.amazonaws.com:3306/codify')
Base = declarative_base()

parent_table = Table('classes_parents', Base.metadata,
                     Column('parent_id', Integer, ForeignKey('classes.id'),
                            primary_key=True),
                     Column('class_id', Integer, ForeignKey('classes.id'),
                            primary_key=True)
                     )


class Class(Base):
    __tablename__ = 'classes'

    id = Column(Integer, primary_key=True)
    name = Column(String(length=255))
    parents = relationship("Class", secondary=parent_table,
                           primaryjoin=id == parent_table.c.class_id,
                           secondaryjoin=id == parent_table.c.parent_id,
                           backref="children")
    methods = relationship("Method", backref="class")
    attributes = relationship("Attribute", backref="class")
    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("Project", backref=backref("classes"))
    abstract = Column(TINYINT)
    description = Column(String(length=1500))

    def __init__(self, name, description, abstract=0):
        self.name = name
        self.abstract = abstract
        self.description = description

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'description': self.description,
            'children': [c.to_dict() for c in self.children],
            'methods': [m.to_dict() for m in self.methods],
            'attributes': [a.to_dict() for a in self.attributes],
            'abstract': self.abstract, 'project_id': self.project_id}


class Argument(Base):
    __tablename__ = 'arguments'
    id = Column(Integer, primary_key=True)
    name = Column(String(length=255))
    attr_type = Column(String(length=50))
    description = Column(String(length=1500))
    method_id = Column(Integer, ForeignKey("methods.id"))
    method = relationship("Method", backref="arguments")

    def __init__(self, name, attr_type, desc):
        self.name = name
        self.attr_type = attr_type
        self.description = desc

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'attr_type': self.attr_type,
                'description': self.description, 'method_id': self.method_id}


class Method(Base):
    __tablename__ = 'methods'

    id = Column(Integer, primary_key=True)
    name = Column(String(length=255))
    class_id = Column(Integer, ForeignKey('classes.id'))
    ret = Column(String(length=50))
    scope = Column(String(length=50))
    description = Column(String(length=1500))

    def __init__(self, name, scope, ret, description):
        self.name = name
        self.scope = scope
        self.ret = ret
        self.description = description

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'class_id': self.class_id,
                'scope': self.scope, 'ret': self.ret,
                'description': self.description,
                'arguments': [a.to_dict() for a in self.arguments]}


class Attribute(Base):
    __tablename__ = 'attributes'

    id = Column(Integer, primary_key=True)
    name = Column(String(length=255))
    class_id = Column(Integer, ForeignKey('classes.id'))
    attr_type = Column(String(length=50))
    scope = Column(String(length=50))
    description = Column(String(length=1500))

    def __init__(self, name, scope, attr_type, desc):
        self.name = name
        self.scope = scope
        self.attr_type = attr_type
        self.description = desc

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'class_id': self.class_id,
                'scope': self.scope, 'attr_type': self.attr_type,
                'description': self.description}


class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True)
    name = Column(String(length=255))
    description = Column(String(length=1500))

    def __init__(self, name, description):
        self.name = name
        self.description = description

    def __repr__(self):
        return json.dumps(self.to_dict())

    def to_dict(self):
        take = []
        used = []
        for c in self.classes:
            if c.id not in used:
                used.append(c.id)
                take.append(c.to_dict())
                for child in c.children:
                    used.append(child.id)
        return {'id': self.id, 'name': self.name,
                'description': self.description, 'classes': take}


def recreate():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)


db = sessionmaker(bind=engine)()


def test_session():
    engine = create_engine('sqlite:///:memory:', echo=True)
    Base = declarative_base
    recreate()
    db = sessionmaker(bind=engine)()


def get_project_json(project_id):
    return str(db.query(Project).filter(Project.id == project_id).first())


def new_project(name, description, id=None):
    if id is None:
        p = Project(name, description)
    else:
        p = db.query(Project).filter(Project.id == id).first()
        p.name = name
        p.description = description
    db.add(p)
    db.commit()
    return p


def new_class(name, description, project_id, abstract=0, attributes=[], id=None):
    if id is None:
        c = Class(name, description, abstract)
        c.project_id = project_id
    else:
        c = db.query(Class).filter(Class.id == id).first()
        c.name = name
        c.description = description
        c.project_id = project_id
        c.abstract = abstract
        old_names = [a.name for a in c.attributes]
        new_attrs = [attr for attr in attributes if attr['name'] not in old_names]
        for a in new_attrs:
            c.attributes.append(new_attribute(a["name"], a["scope"], a["attr_type"], a["description"]))
    db.add(c)
    db.commit()
    return c.id


def add_child(child_id, parent_name):
    child = db.query(Class).filter(Class.id == child_id).first()
    parent = db.query(Class).filter(Class.name == parent_name).first()
    project = parent.project
    if parent is not None and child not in parent.children and parent not in child.parents and parent != child:
        parent.children.append(child)
    else:
        return False
    db.add(parent)
    db.commit()
    return project.to_dict()


def new_method(name, scope, ret, description, class_id, arguments=[], id=None):
    if id is None:
        m = Method(name, scope, ret, description)
        m.class_id = class_id
        m.arguments = []
    else:
        m = db.query(Method).filter(Method.id == id).first()
        m.name = name
        m.ret = ret
        m.description = description
        m.class_id = class_id
        old_names = [a.name for a in m.arguments]
        new_attrs = [arg for arg in arguments if arg['name'] not in old_names]
        for a in new_attrs:
            new_argument(a["name"], a["attr_type"], a["description"], m.id)
    db.add(m)
    db.commit()
    return m.to_dict()


def new_attribute(name, scope, attr_type, description, id=None):
    if id is None:
        a = Attribute(name, scope, attr_type, description)
    else:
        a = db.query(Attribute).filter(Attribute.id == id).first()
        a.name = name
        a.scope = scope
        a.attr_type = attr_type
        a.description = description
        db.add(a)
    db.commit()
    return a


def new_argument(name, attr_type, description, method_id):
    a = Argument(name, attr_type, description)
    a.method_id = method_id
    db.add(a)
    db.commit()


def delete_row(id, model, project_id):
    if model == "class":
        db.query(Class).filter(Class.id == id).delete()
    elif model == "method":
        db.query(Method).filter(Method.id == id).delete()
    elif model == "attribute":
        db.query(Attribute).filter(Attribute.id == id).delete()
    elif model == "argument":
        db.query(Argument).filter(Argument.id == id).delete()
    elif model == "project":
        db.query(Project).filter(Project.id == id).delete()
        return False
    else:
        return None


def close_session():
    db.close()
