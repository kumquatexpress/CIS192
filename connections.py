from geventwebsocket import WebSocketError
import json

class ClientGroup:
    def __init__(self,proj_id):
        self.id = proj_id
        self.connections = []

    def broadcast(self,msg,ws=None):
        print "Broadcasting %s to %s" % (msg,str(self.connections))
        print "Self is %s" % str(ws)
        for cc in self.connections:
            if cc is not ws:
                try:
                    cc.send_msg(msg)
                except WebSocketError:
                    cc.close()


    def broadcast_json(self,json_obj,ws=None):
        self.broadcast(json.dumps(json_obj),ws)

class ClientConnection:
    def __init__(self,ws,conn_group):
        self.ws = ws
        self.group = conn_group
        if conn_group is not None:
            conn_group.connections.append(self)

    def send_json(self,json_obj):
        self.send_msg(json.dumps(json_obj))

    def send_msg(self,msg):
        self.ws.send(msg)
        print "Sent : %s" % msg

    def get_json(self):
        print "Listening"
        raw_msg = self.ws.receive()
        print "Received %s" % raw_msg
        if raw_msg is None:
            raise WebSocketError
        return json.loads(raw_msg)

    def close(self):
        self.group.connections.remove(self)

