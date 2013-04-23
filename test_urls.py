import requests
import nose
import class_models as models
from nose.tools import eq_


base_url = "http://localhost:8080/"


def test_project_original():
    url = base_url + "projects/1"
    project = requests.get(url).text
    db_project = models.db.query(models.Project).filter(models.Project.id == 1).first()
    eq_(project, str(db_project))


def test_new_project():
    first_count = models.db.query(models.Project).count()
    url = base_url + "new"
    requests.post(url, params={"name": "something", "description": "somethingelse"})
    eq_(models.db.query(models.Project).count(), first_count + 1)
