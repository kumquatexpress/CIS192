from connections import ClientGroup, ClientConnection
from geventwebsocket import WebSocketError
import class_models as models


def start_connection(ws, groups):
    cc = ClientConnection(ws, None)
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
    print "%s is not connected" % str(cc)
    return cc


def handle_json(json_obj, conn):
    obj_type = json_obj['type']
    action_type = json_obj['action']
    obj_info = json_obj["info"]
    broadcast = True
    if action_type == "add" or action_type == "modify":
        if obj_type == "class":
            json_obj["info"]["id"] = new_class(obj_info)
        elif obj_type == "method":
            json_obj["info"] = new_method(obj_info)
        else:
            pass
    elif action_type == "delete":
        delete_row(json_obj)
    elif action_type == "inherit":
        if obj_type == "class":
            broadcast = add_child(obj_info)
            if broadcast:
                json_obj["info"] = broadcast
    else:
        pass
    if broadcast:
        out_obj = {"tag": "update", "data": json_obj}
        conn.group.broadcast_json(out_obj)
        models.close_session()


def add_child(json_obj):
    child_id = json_obj["child"]
    parent_name = json_obj["p"]
    return models.add_child(child_id, parent_name)


def new_class(json_obj):
    name = json_obj["name"]
    project_id = json_obj["project_id"]
    if "abstract" not in json_obj:
        abstract = None
    else:
        abstract = json_obj["abstract"]
    description = json_obj["description"]
    if "id" not in json_obj:
        cid = None
        attributes = None
    else:
        cid = json_obj["id"]
        attributes = json_obj["attributes"]
    return models.new_class(name, description, project_id, abstract, attributes, cid)


def new_method(json_obj):
    name = json_obj["name"]
    scope = json_obj["scope"]
    desc = json_obj["description"]
    ret = json_obj["ret"]
    class_id = json_obj["class_id"]
    if "id" not in json_obj:
        mid = None
        args = None
    else:
        mid = json_obj["id"]
        args = json_obj["arguments"]
    return models.new_method(name, scope, ret, desc, class_id, args, mid)


def new_attribute(json_obj):
    name = json_obj["name"]
    scope = json_obj["scope"]
    desc = json_obj["description"]
    attr_type = json_obj["attr_type"]
    if "id" not in json_obj:
        aid = None
    else:
        aid = json_obj["id"]
    return models.new_attribute(name, scope, attr_type, desc, aid)


def new_argument(json_obj):
    method_id = json_obj["method_id"]
    name = json_obj["name"]
    attr_type = json_obj["attr_type"]
    desc = json_obj["description"]
    return models.new_argument(name, attr_type, desc, method_id)


def delete_row(json_obj):
    model = json_obj["model"]
    rid = json_obj["id"]
    project_id = json_obj["project_id"]
    return models.delete_row(rid, str(model), project_id)
