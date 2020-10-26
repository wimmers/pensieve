import time
from flask import Flask, jsonify, request
import json
from pprint import pprint
import sys
import os
from create_graph import read_and_convert

app = Flask(__name__)
app.config['SECRET_KEY'] = 'abcd'

THE_PATH = "../scratch"

HEADER_FIELDS = [
    "files",
    "deleted",
    "favorited",
    "pinned",
    "tags",
    "name",
    "created",
    "modified",
]

db = {}

def make_file_name(name):
    return os.path.join(THE_PATH, f"{name}.md")


def default_serializer(k):
    return lambda v: f"{k}: {v}"


def list_to_string(lst):
    return f"[{', '.join(str(x) for x in lst)}]"


def key_and_list_to_string(k):
    return lambda lst: f"{k}: {list_to_string(lst)}"


def add_single_quotes(k):
    return lambda v: f"{k}: '{v}'"


serializers = {
    "name": lambda v: f"title: {v}",
    "attachments": key_and_list_to_string("attachments"),
    "tags": key_and_list_to_string("tags"),
    "created": add_single_quotes("created"),
    "modified": add_single_quotes("modified")
}


def write_note(node):
    def serialize(x):
        k, v = x
        serializer = serializers.get(k)
        if serializer is None:
            return f"{k}: {v}"
        return serializer(v)
    info = node['info']
    file_name = make_file_name(info['name'])
    header = {field: info[field] for field in HEADER_FIELDS if info.get(field)}
    header = '\n'.join(map(serialize, header.items()))
    header = f"---\n{header}\n---\n\n"
    text = header + node.get('note', "")
    with open(file_name, 'w') as file:
        file.write(text)


def delete_note(name):
    file_name = make_file_name(name)
    if os.path.isfile(file_name):
        os.remove(file_name)
    else:
        print("Error: {file_name} does not exist!", file=sys.stderr)


def apply_change(old, new):
    if old == new:
        print("Skipped: no real change...")
        return
    write_note(new)
    old_name = old['info']['name']
    new_name = new['info']['name']
    if old_name != new_name:
        delete_note(old_name)


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


def create_db(graph):
    global db
    db = {}
    for item in graph:
        data = item.get('data')
        if not data:
            continue
        if 'info' in data:
            db[data['id']] = data


@app.route('/init')
def get_init_json():
    graph = read_and_convert(THE_PATH)
    create_db(graph)
    return jsonify(graph)


@app.route('/add', methods=['POST'])
def add_note():
    global db
    new_note = request.get_json(force=True)
    write_note(new_note)
    db[new_note['id']] = new_note
    return {}


@app.route('/update', methods=['POST'])
def change_note():
    global db
    note = request.get_json(force=True)
    old = db.get(note['id'])
    # Assume node was a tag and ignore the update
    if not old:
        return {}
    apply_change(old, note)
    db[note['id']] = note
    return {}
