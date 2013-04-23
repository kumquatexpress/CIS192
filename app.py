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
    proj_id = request.args.get("id")
    return render_template('project.html', project_id=proj_id)


@app.route("/projects/<proj_id>.json")
def view_project(proj_id):
    output = models.get_project_json(proj_id)
    print output
    return output


@app.route("/sample_data")
def sample_data():
    data = {
        "id": "1",
        "name": "My Project",
        "description": "It's a frickin awesome project",
        "classes": [
        {
            "id": "1",
            "name": "Commentable",
            "project": "1",
            "description": "Interface for things that are commentable",
            "attributes": [
            {"scope": "private", "name": "other_id", "attr_type": "int", "description": "The other id."},
            {"scope": "private", "name": "details", "attr_type": "string", "description": "Some details."}
            ],
            "classes": [
                {
                    "id": "2",
                    "name": "Comment",
                    "project": "1",
                    "description": "It's a class for comments",
                    "classes": [
                        {
                            "id": "4",
                            "name": "Hello World",
                            "project": "1",
                            "description": "hi",
                            "interfaces": ["Commentable"],
                            "attributes": [],
                            "methods": []
                        }
                    ],
                    "interfaces": ["Commentable", "Likeable"],
                    "attributes": [
                    {"scope": "private", "name": "id", "attr_type": "int", "description": "The DB id."},
                    {"scope": "private", "name": "comment", "attr_type": "string", "description": "The comment"}
                    ],
                    "methods": [
                    {
                        "id":  "1",
                        "scope": "public",
                        "name": "like",
                        "description": "testing",
                        "ret": "void",
                        "args": [
                        {"name": "user", "attr_type": "User", "description": "The user liking it"},
                        {"name": "timestamp", "attr_type": "long", "description": "The UNIX timestamp"}
                        ]
                    }
                    ]
                }
            ],
            "methods": [
            {
                "id":  "1",
                "scope": "public",
                "name": "addComment",
                "ret": "boolean",
                "args": [
                {"name": "comment", "attr_type": "string", "description": "The comment to add"},
                {"name": "user", "attr_type": "User", "description": "The user commenting."}
                ]
            }
            ]
        },
            {
                "id": "5",
                "name": "uncommentable yo",
                "project": "1",
                "description": "hi",
                "interfaces": [""],
                "attributes": [],
                "methods": []
            }
        ],
        "interfaces": [

        ]
    }
    return jsonify(data)


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
