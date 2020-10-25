# %%
from os import read
import re
import os
import json
import itertools

# %%
title_re = (
    r"---"
    r"(\nattachments: \[(?P<files>[^\]]+)\])?"
    r"(\ndeleted: (?P<deleted>true))?"
    r"(\nfavorited: (?P<favorited>true))?"
    r"(\npinned: (?P<pinned>true))?"
    r"(\ntags: \[(?P<tags>([/\w]+, )*[/\w]+)\])?"
    r"\ntitle: (?P<name>[^\n]+)"
    r"\ncreated: '(?P<created>[^\n]+)'"
    r"\nmodified: '(?P<modified>[^\n]+)'"
    r"\n---\n\n"
)

# %%
with open("../scratch/NPM.md") as f:
    text = f.read()
m = re.match(title_re, text)
# %%
link_re = r"\[(?P<type>[^\]]+)\]\(@note/(?P<name>[\w\s]+)\.md\)"
# %%
matches1 = re.findall(link_re, text)
# %%
with open("../scratch/Zenoness.md") as f:
    text = f.read()
matches2 = re.findall(link_re, text)
# %%


def parse_text(text):
    m = re.match(title_re, text)
    if m is None:
        raise ValueError("Could not parse header information!")
    header_info = m.groupdict()
    tags = header_info['tags']
    if tags is not None:
        tags = tags.split(", ")
        header_info['tags'] = tags
    types = ["#crossref", "#from"]
    links = re.findall(link_re, text)
    links = [(typ[1:], name) for typ, name in links if typ in types]
    note = text[m.end():]
    return {"info": header_info, "links": links, "note": note}


def handle_file(file_name):
    with open(file_name) as file:
        text = file.read()
        return parse_text(text)


# %%
handle_file("/Users/wimmers/.notable/notes/Research Blogs.md")
handle_file("/Users/wimmers/.notable/notes/On the Web.md")
# %%


def read_directory(dir_name):
    (dirpath, _, filenames) = next(os.walk(dir_name))
    file_paths = [os.path.join(dirpath, name)
                  for name in filenames if name.endswith('.md')]
    results = []
    for path in file_paths:
        try:
            results.append(handle_file(path))
        except ValueError:
            print(f"Error in file {path}")
    return results


# %%
data = read_directory("../scratch")
# %%


def convert_data(data):
    id_counter = 0
    id_mapping = {}
    nodes = []
    for item in data:
        node_data = {
            'info': item['info'],
            'label': item['info']['name'],
            'id': str(id_counter),
            'note': item['note']
        }
        id_mapping[item['info']['name']] = str(id_counter)
        id_counter += 1
        node = {"data": node_data}
        nodes.append(node)

    tags = (item['info']['tags'] for item in data if item['info']['tags'])
    tags = set(itertools.chain(*tags))
    tag_mapping = {}
    for tag in tags:
        node_data = {
            "label": tag,
            # "is_tag": True,
            "group": "tag",
            "id": str(id_counter)
        }
        tag_mapping[tag] = str(id_counter)
        id_counter += 1
        node = {"data": node_data}
        nodes.append(node)

    edges = []
    for item in data:
        tags = item['info']['tags'] or []
        source = item['info']['name']
        source_id = id_mapping[source]
        for tag in tags:
            target_id = tag_mapping[tag]
            edge_data = {"source": source_id,
                         "target": target_id, "style": "dotted"}
            edge = {"data": edge_data}
            edges.append(edge)

    for item in data:
        source = item['info']['name']
        source_id = id_mapping[source]
        for typ, target in item['links']:
            if target not in id_mapping:
                print(f"Ignored dead link from {source} to {target}!")
                continue
            target_id = id_mapping[target]
            edge_data = {"source": source_id, "target": target_id}
            if typ == "crossref":
                edge_data["style"] = "dashed"
            edge = {"data": edge_data}
            edges.append(edge)
    return nodes + edges


# %%
convert_data(data)
# %%


def do_it(in_path, out_path):
    data = read_directory(in_path)
    data = convert_data(data)
    with open(out_path, 'w') as file:
        json.dump(data, file, indent=4)


# %%
do_it("/Users/wimmers/.notable/notes", "notes.json")
# %%
