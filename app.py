from geventwebsocket.handler import WebSocketHandler
from geventwebsocket import WebSocketError
from gevent.pywsgi import WSGIServer
from flask import Flask, request, render_template
import json

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
def api():
    if request.environ.get('wsgi.websocket'):
        try:
            ws = request.environ['wsgi.websocket']
            print dir(ws)
            while True:
                print "waiting"
                message = ws.receive()
                obj = json.loads(message)
                ws.send(str(obj))
                proj = obj['project_id']
                print proj
                if proj in connections:
                    connections[proj].append(ws)
                else:
                    connections[proj] = [ws]
                for s in connections[proj]:
                    try:
                        s.send("You're in proj %s" % proj)
                    except WebSocketError:
                        connections[proj].remove(s)
                    print "sending"
        except WebSocketError:
            print "Connection closed"
    return ""

if __name__ == '__main__':
    app.debug = True
    http_server = WSGIServer(('', 8080), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
