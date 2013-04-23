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
    return cc


def handle_json(json_obj):
    obj_type = json_obj['type']
    action_type = json_obj['action']
    obj_info = json_obj["info"]
    if action_type == "new" or "update":
        if obj_type == "class":
            new_class(obj_info)
        elif obj_type == "project":
            return new_project(obj_info)
        elif obj_type == "method":
            new_method(obj_info)
        elif obj_type == "attribute":
            new_attribute(obj_info)
        elif obj_type == "argument":
            new_argument(obj_info)
        else:
            pass
    elif action_type == "delete":
        delete_row(json_obj)
    else:
        pass
    return models.get_project_json(json_obj['project_id'])


def new_class(json_obj):
    name = json_obj["name"]
    project_id = json_obj["id"]
    abstract = json_obj["abstract"]
    description = json_obj["desc"]
    cid = json_obj["id"]
    return models.new_class(name, description, project_id, abstract, cid)


def new_method(json_obj):
    name = json_obj["name"]
    scope = json_obj["scope"]
    desc = json_obj["desc"]
    ret = json_obj["ret"]
    class_id = json_obj["class_id"]
    mid = json_obj["id"]
    return models.new_method(name, scope, ret, desc, class_id, mid)


def new_attribute(json_obj):
    name = json_obj["name"]
    scope = json_obj["scope"]
    desc = json_obj["desc"]
    attr_type = json_obj["attr_type"]
    aid = json_obj["id"]
    return models.new_attribute(name, scope, attr_type, desc, aid)


def new_argument(json_obj):
    method_id = json_obj["method_id"]
    name = json_obj["name"]
    attr_type = json_obj["attr_type"]
    desc = json_obj["desc"]
    return models.new_argument(name, attr_type, desc, method_id)


def delete_row(json_obj):
    model = json_obj["model"]
    rid = json_obj["id"]
    project_id = json_obj["project_id"]
    return models.delete_row(rid, str(model), project_id)
