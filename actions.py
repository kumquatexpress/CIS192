from connections import ClientGroup, ClientConnection
from geventwebsocket import WebSocketError

def start_connection(ws,groups):
    cc = ClientConnection(ws,None)
    handshake = cc.get_json()
    try:
        proj_id = handshake['project_id']
    except KeyError:
        print "Error occured, invalid handshake format"
        raise WebSocketError()
    try:
        group = groups[proj_id]
    except KeyError:
        group = ClientGroup(proj_id)
        groups[proj_id] = group
    cc.group = group
    group.connections.append(cc)
    return cc

def handle_json(json_obj):
    obj_type = json_obj['type']
    action_type = json_obj['action']
    if msg_type == "method":
        pass
    elif msg_type == "class":
        pass
    else:
        pass