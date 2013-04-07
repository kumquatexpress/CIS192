from geventwebsocket.handler import WebSocketHandler
from geventwebsocket import WebSocketError
from gevent.pywsgi import WSGIServer
from flask import Flask, request, render_template
 
app = Flask(__name__)

connections = []

@app.route("/")
def main_page():
    return render_template('index.html')


@app.route("/hierarchy")
def hierarchy():
    return render_template('hierarchy.html')
 
@app.route('/ws')
def api():
    if request.environ.get('wsgi.websocket'):
        try:
            ws = request.environ['wsgi.websocket']
            connections.append(ws)
            print dir(ws)
            while True:
                print "waiting"
                message = ws.receive()
                ws.send(message)
                for s in connections:
                    if s is not ws:
                        s.send(message)
                    print "sending"
        except WebSocketError:
            print "Connection closed"
    return ""
 
if __name__ == '__main__':
    app.debug = True
    http_server = WSGIServer(('',8080), app, handler_class=WebSocketHandler)
    http_server.serve_forever()