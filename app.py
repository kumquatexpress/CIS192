from geventwebsocket.handler import WebSocketHandler
from geventwebsocket import WebSocketError
from gevent.pywsgi import WSGIServer
from flask import Flask, request, render_template, jsonify
import actions
import class_models as models

app = Flask(__name__)

connections = {}


@app.route("/")
def experiment():
    return render_template('index.html')


@app.route("/create")
def create():
    return render_template('create.html')


@app.route("/hierarchy")
def hierarchy():
    return render_template('hierarchy.html')


@app.route("/list")
def list():
    return render_template('list.html')


@app.route("/new")
def new():
    return render_template('new.html')


@app.route("/project")
def project():
    proj_id = request.args.get("id")
    return render_template('project.html', project_id=proj_id)


@app.route("/sample_data")
def sample_data():
    return jsonify({})


@app.route("/project/new")
def new_project():
    name = request.args.get("name")
    description = request.args.get("description")
    pid = request.args.get("id")
    return models.new_project(name, description, pid)


@app.route("/class/new")
def new_class():
    name = request.args.get("name")
    project_id = request.args.get("id")
    abstract = request.args.get("abstract")
    description = request.args.get("description")
    cid = request.args.get("id")
    return models.new_class(name, description, project_id, abstract, cid)


@app.route("/method/new")
def new_method():
    name = request.args.get("name")
    project_id = request.args.get("id")
    scope = request.args.get("scope")
    desc = request.args.get("desc")
    ret = request.args.get("ret")
    class_id = request.args.get("class_id")
    mid = request.args.get("id")
    return models.new_method(name, scope, ret, desc, class_id, project_id, mid)


@app.route("/attribute/new")
def new_attribute():
    name = request.args.get("name")
    project_id = request.args.get("id")
    scope = request.args.get("scope")
    desc = request.args.get("desc")
    attr_type = request.args.get("attr_type")
    aid = request.args.get("id")
    return models.new_attribute(name, scope, attr_type, desc, project_id, aid)


@app.route('/ws')
def ws():
    if request.environ.get('wsgi.websocket'):
        try:
            cc = actions.start_connection(request.environ['wsgi.websocket'], connections)
            print "Client now connected, listening for connections"
            while True:
                in_obj = cc.get_json()
                out_obj = {"tag": "update", "data": in_obj}
                cc.group.broadcast_json(out_obj)
                actions.handle_json(in_obj)
        except WebSocketError:
            print "Connection closed"
            try:
                cc.close()
            except NameError:
                pass
    return ""

if __name__ == '__main__':
    app.debug = True
    http_server = WSGIServer(('', 8080), app, handler_class=WebSocketHandler)
    print "Now listening on port 8080"
    http_server.serve_forever()
