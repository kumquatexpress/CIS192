from geventwebsocket.handler import WebSocketHandler
from geventwebsocket import WebSocketError
from gevent.pywsgi import WSGIServer
from flask import Flask, request, render_template
import json
import actions

app = Flask(__name__)

connections = {}

@app.route("/")
def experiment():
    return render_template('index.html')

@app.route("/create")
def main_page():
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
    return render_template('project.html')


@app.route('/ws')
def ws():
    if request.environ.get('wsgi.websocket'):
        try:
            cc = actions.start_connection(request.environ['wsgi.websocket'],connections)
            while True:
                in_obj = cc.get_json()
                out_obj = {"tag" : "update", "data" : in_obj}
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
