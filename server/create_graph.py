import re
import os
import itertools


title_re = (
    r"---"
    r"(\nattachments: \[(?P<attachments>[^\]]+)\])?"
    r"(\ndeleted: (?P<deleted>(true|false)))?"
    r"(\nfavorited: (?P<favorited>(true|false)))?"
    r"(\npinned: (?P<pinned>(true|false)))?"
    r"(\ntags: \[(?P<tags>([/\w]+, )*[/\w]+)\])?"
    r"\ntitle: (?P<name>[^\n]+)"
    r"\ncreated: '(?P<created>[^\n]+)'"
    r"\nmodified: '(?P<modified>[^\n]+)'"
    r"\n---\n\n"
)

link_re = r"\[(?P<type>[^\]]+)\]\((?:@note/)?(?P<name>[^().\[\]]+)\.md\)"


def parse_text(text):
    m = re.match(title_re, text)
    if m is None:
        raise ValueError("Could not parse header information!")
    header_info = m.groupdict()
    tags = header_info['tags']
    if tags is not None:
        tags = tags.split(", ")
        header_info['tags'] = tags
    links = re.findall(link_re, text)
    note = text[m.end():]
    return {"info": header_info, "links": links, "note": note}


def handle_file(file_name):
    with open(file_name) as file:
        text = file.read()
        return parse_text(text)


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
            if typ == "#crossref":
                edge_data["style"] = "dashed"
            elif typ != "#from":
                edge_data["style"] = "dotted"
            else:
                edge_data["label"] = typ
            edge = {"data": edge_data}
            edges.append(edge)
    return nodes + edges


def read_and_convert(in_path):
    return convert_data(read_directory(in_path))
