from sqlalchemy.orm import relationship, backref, sessionmaker

engine = create_engine('mysql://codify@cis330.ca9iefbk06km.us-east-1.rds.amazonaws.com:3306/codify')


def make_big_json(proj_id):
    session = sessionmaker(bind=engine)()
    result = session.query(Project).filter(Project.id == proj_id).first()
    if result is not None:
