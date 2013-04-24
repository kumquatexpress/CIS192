from geventwebsocket.handler import WebSocketHandler
from geventwebsocket import WebSocketError
from gevent.pywsgi import WSGIServer
from flask import Flask, request, render_template, jsonify, redirect
import actions
import class_models as models

app = Flask(__name__)

connections = {}


@app.route("/")
def experiment():
    return render_template('create.html')


@app.route("/hierarchy")
def hierarchy():
    return render_template('hierarchy.html')


@app.route("/list")
def list():
    return render_template('list.html')


@app.route("/new", methods=["POST"])
def new():
    proj = models.new_project(request.form["name"], request.form["description"])
    return redirect("/project?id=%s" % proj.id)


@app.route("/project")
def project():
    return render_template('project.html', project_id=request.args.get("id"))


@app.route("/projects/<proj_id>", methods=["POST"])
def view_project(proj_id):
    return models.get_project_json(proj_id)

@app.route('/ws')
def ws():
    if request.environ.get('wsgi.websocket'):
        try:
            cc = actions.start_connection(request.environ['wsgi.websocket'], connections)
            print "Client now connected, listening for connections"
            while True:
                actions.handle_json(cc.get_json(), cc)
        except WebSocketError:
            print "Connection closed"
            try:
                cc.close()
            except NameError:
                pass
    return ""

if __name__ == '__main__':
    http_server = WSGIServer(('', 8080), app, handler_class=WebSocketHandler)
    print "Now listening on port 8080"
    http_server.serve_forever()
