from sqlalchemy import Column, Table, Boolean, Integer, String, create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref, sessionmaker

engine = create_engine('mysql://codify@cis330.ca9iefbk06km.us-east-1.rds.amazonaws.com:3306/codify')
Base = declarative_base()

parent_table = Table('classes_parents', Base.metadata,
                     Column('parent_id', Integer, ForeignKey('classes.id'), primary_key=True),
                     Column('class_id', Integer, ForeignKey('classes.id'), primary_key=True)
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
    abstract = Column(Boolean)
    description = Column(String(length=1500))

    def __init__(self, name, description, abstract=False):
        self.name = name
        self.abstract = abstract
        self.description = description

    def __repr__(self):
        result = {'id': self.id, 'name': self.name, 'description': self.description, 'children': self.children,
                  'methods': self.methods, 'attributes': self.attributes, 'abstract': self.abstract, 'project_id': self.project_id}
        return str(result)


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
        result = {'id': self.id, 'name': self.name, 'attr_type': self.attr_type,
                  'description': self.description, 'method_id': self.method_id}
        return str(result)


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
        result = {'id': self.id, 'name': self.name, 'class_id': self.class_id,
                  'scope': self.scope, 'ret': self.ret, 'description': self.description,
                  'arguments': self.arguments}
        return str(result)


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
        result = {'id': self.id, 'name': self.name, 'class_id': self.class_id,
                  'scope': self.scope, 'attr_type': self.attr_type, 'description': self.description}
        return str(result)


class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True)
    name = Column(String(length=255))
    description = Column(String(length=1500))

    def __init__(self, name, description):
        self.name = name
        self.description = description

    def __repr__(self):
        result = {'id': self.id, 'name': self.name, 'description': self.description, 'classes': self.classes}
        return str(result)


def recreate():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)


def make_session():
    return sessionmaker(bind=engine)()


def new_project(name, description):
    db = make_session()
    p = Project(name, description)
    db.add(p)
    db.commit()
    return p


def new_class(name, description, project_id, abstract=False):
    db = make_session()
    c = Class(name, description, abstract)
    c.project_id = project_id
    db.add(c)
    db.commit()
    p = db.query(Project).filter(Project.id == c.project_id).first()
    return p


def new_method(name, scope, ret, description, class_id, project_id):
    db = make_session()
    m = Method(name, scope, ret, description)
    m.class_id = class_id
    db.add(m)
    db.commit()
    p = db.query(Project).filter(Project.id == project_id).first()
    return p


def new_attribute(name, scope, attr_type, description, project_id):
    db = make_session()
    a = Attribute(name, scope, attr_type, description)
    db.commit(a)
    p = db.query(Project).filter(Project.id == project_id).first()
    return p

# to use ORM, call
    # Session = sessionmaker(bind=engine)
    # session = Session() whenever a new session is required
    # session.add/.add_all(objects) to add to session buffer
    # session.commit() to push to database
    # Query >>> for name, fullname in session.query(User.name, User.fullname):
    #     print name, fullname


# p = Project("testp")
# c = Class("testc")
    # p.classes is [] right now, c.project_id does not exist
# d = Class("testc2")
# p.classes = [c, d]
    # d.project_id is now p.id
    # c.project now returns p
    # all of this happens before committing