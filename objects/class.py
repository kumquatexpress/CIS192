from sqlalchemy import Column, Table, Integer, String, Date, MetaData
from sqlalchemy import create_engine, ForeignKey
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


class Method(Base):
    __tablename__ = 'methods'

    id = Column(Integer, primary_key=True)
    name = Column(String(length=255))
    class_id = Column(Integer, ForeignKey('classes.id'))


# to use ORM, call
    # Session = sessionmaker(bind=engine)
    # session = Session() whenever a new session is required
    # session.add/.add_all(objects) to add to session buffer
    # session.commit() to push to database
