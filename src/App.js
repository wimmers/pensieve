import './App.css';
import React, { Component, useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import GraphView from './GraphView';
import MarkdownEditor from '@uiw/react-markdown-editor';
import ReactTags from 'react-tag-autocomplete';


const enumerate = (list) => {
  const result = []
  for (var i = 0; i < list.length; i++) {
    result[i] = { id: i, name: list[i] }
  }
  return result
}

const deenumerate = (list) => {
  const result = []
  for (var i = 0; i < list.length; i++) {
    result[i] = list[i].name
  }
  return result
}

const Tags = (props) => {
  const [tags, setTags] = useState(props.tags ? enumerate(props.tags) : [])

  const onDeleteTag = (i) => {
    const newTags = tags.slice(0)
    newTags.splice(i, 1)
    setTags(newTags)
    props.onChangeTags(deenumerate(newTags))
  }

  const onAddTag = (tag) => {
    const newTags = [].concat(tags, tag)
    setTags(newTags)
    props.onChangeTags(deenumerate(newTags))
  }

  return (
    <ReactTags
      allowNew={true}
      // suggestions={state.suggestions}
      tags={tags}
      onDelete={onDeleteTag}
      onAddition={onAddTag}
    />
  )
}

const Input = (props) => {
  const [value, setValue] = useState(props.value)

  return (
    <Form.Control
      plaintext
      type="text"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={_ => props.onBlur(value)}
      className="mb-2 title"
    />
  )
}


const empty_info = {
  "attachments": null,
  "deleted": null,
  "favorited": null,
  "pinned": null,
  "tags": null,
  "name": null,
  "created": null,
  "modified": null
}

class App extends Component {

  constructor(props) {
    super(props)
    this.onRefresh = this.onRefresh.bind(this)
  }

  state = {
    selected: undefined,
    adding: null,
    linking: null,
    searchQuery: '',
    lastCursor: undefined
  }

  graphView = React.createRef()

  markdownEditor = React.createRef()

  sendJSON = (endpoint, json) => {
    return fetch(endpoint, {
      mode: 'no-cors',
      method: 'POST',
      body: JSON.stringify(json),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  sendAddNote = node => {
    if (!process.env.REACT_APP_DEMO)
      return this.sendJSON('/add', node)
  }

  sendChangeNote = (node) => {
    if (!process.env.REACT_APP_DEMO)
      return this.sendJSON('/update', node)
  }

  onAddNote = data => {
    this.setState({ ...this.state, adding: "note" })
  }

  onAddFrom = data => {
    this.setState({ ...this.state, linking: "from" })
  }

  onAddCrossref = data => {
    this.setState({ ...this.state, linking: "crossref" })
  }

  onAddLink = data => {
    this.setState({ ...this.state, linking: "link" })
  }

  unsetFlags = () => {
    this.setState({ ...this.state, adding: null, linking: null })
  }

  insertTextAtCursor(text, move=undefined) {
    const editor = this.markdownEditor.current.CodeMirror.editor
    const doc = editor.getDoc()
    const cursor = this.state.lastCursor || doc.getCursor()
    doc.replaceRange(text, cursor)
    if (move) {
      editor.setCursor(cursor.line, cursor.ch + move)
    }
    editor.focus()
  }

  onTapNode = node => {
    const state = this.state
    if (state.linking && state.selected) {
      const targetName = node.data('label')
      var text = `[#${state.linking}](@note/${targetName}.md)`
      var move = text.length
      let style, label;
      switch (state.linking) {
        case 'from': style = 'solid'; label = undefined; break;
        case 'crossref': style = 'dashed'; label = undefined; break;
        case 'link':
          style = 'dotted'; label = 'link'
          text = `[](${targetName}.md)`
          move = 1
      }
      this.graphView.current.addEdge(state.selected.data('id'), node.data('id'), style, label)
      this.insertTextAtCursor(text, move)
      this.unsetFlags()
      return true
    }
    this.unsetFlags()
    return false
  }

  onSelectEdge = edge => {
    this.unsetFlags()
  }

  onTapBackground = event => {
    if (this.state.adding === "note") {
      const graphView = this.graphView.current
      const node = graphView.addNodeFromEvent(event)
      const name = "Untitled"
      const timestamp = new Date().toISOString()
      const info = { ...empty_info, name: name, created: timestamp, modified: timestamp }
      node.json({ data: { info: info, label: name } })
      this.sendAddNote(node.data())
    }
    this.unsetFlags()
  }

  async onRefresh(data) {
    const state = this.state
    if (state.selected) {
      await this.sendChangeNote(state.selected.data())
    }
    this.graphView.current.loadGraph()
    this.setState({ ...this.state, searchQuery: '' })
  }

  onSelectNode = node => {
    this.setState({ ...this.state, selected: node })
    const value = node.data('note') || ''
    this.markdownEditor.current.CodeMirror.editor.setValue(value)
  }

  onDeselectNode = node => {
    this.setState({ ...this.state, selected: null, lastCursor: null })
  }

  updateAndSend = (diff) => {
    const node = this.state.selected
    node.json(diff)
    this.sendChangeNote(node.data())
  }

  updateMarkdown = (editor) => {
    const cursor = editor.getDoc().getCursor()
    if (cursor.sticky || cursor.line !== 0 || cursor.ch !== 0)
      this.setState({...this.state, lastCursor: cursor})
    const node = this.state.selected
    if (!node)
      return
    const value = editor.getValue()
    if (value === node.data('note'))
      return
    const timestamp = new Date().toISOString()
    const info = { ...node.data('info'), modified: timestamp }
    const diff = { data: { note: value, info: info } }
    editor.setValue(value)
    this.updateAndSend(diff)
  }

  onChangeTags = (tags) => {
    const node = this.state.selected
    const diff = { data: { info: { ...node.data('info'), tags } } }
    this.updateAndSend(diff)
  }

  onChangeName = (value) => {
    const node = this.state.selected
    const diff = { data: { info: { ...node.data('info'), name: value }, label: value } }
    this.updateAndSend(diff)
  }

  onSearch = (event) => {
    const value = event.target.value
    this.setState({ ...this.state, searchQuery: value, selected: undefined })
    if (!value || this.state.searchQuery === value)
      return
    const graphView = this.graphView.current
    const cy = graphView.cy
    const query = `node[label *= "${value}"], node[note *= "${value}"]`
    var connected = cy.$(query)
    connected = connected.union(connected.neighborhood())
    const notConnected = cy.elements().not(connected);
    const removed = cy.remove(notConnected);
    if (removed.length > 0)
      graphView.runLayout()
  }

  render() {
    const state = this.state
    const node = state.selected
    const linkDisabled = !node
    return ([
      <Container fluid>
        <div className="graphview">
          <GraphView
            onSelectEdge={this.onSelectEdge}
            onSelectNode={this.onSelectNode}
            onDeselectNode={this.onDeselectNode}
            onTapBackground={this.onTapBackground}
            onTapNode={this.onTapNode}
            ref={this.graphView}
          />
        </div>
      </Container>,
      <Container fluid className="p-3">
        <div className="mb-1">
          <Button className="mb-1" variant="primary" onClick={this.onAddNote}>
            + note
          </Button>{' '}
          <Button className="mb-1" variant="secondary"
            onClick={this.onAddFrom} disabled={linkDisabled}>
            + from
          </Button>{' '}
          <Button className="mb-1" variant="dark"
            onClick={this.onAddCrossref} disabled={linkDisabled}>
            + crossref
          </Button>{' '}
          <Button className="mb-1" variant="light"
            onClick={this.onAddLink} disabled={linkDisabled}>
            + link
          </Button>{' '}
          <Button className="mb-1" variant="danger" onClick={this.onRefresh}>
            refresh
          </Button>
        </div>
        <Row>
          <Col xs="12" lg="8" xl="9" className='mb-2'>
            <MarkdownEditor
              onBlur={this.updateMarkdown}
              visible={false}
              height={500}
              ref={this.markdownEditor}
            />
          </Col>
          <Col xs="12" lg="4" xl="3">
            {
              !(node && node.data('info')) ? '' :
                <div className='mb-2'>
                  <Input
                    value={node.data('label')}
                    onBlur={this.onChangeName}
                  />{' '}
                  <Tags
                    tags={node.data('info').tags}
                    onChangeTags={this.onChangeTags}
                  />
                </div>
            }
            <div>
              <div>
                <span>Search:</span>
                <Form.Control
                  type="text"
                  value={state.searchQuery}
                  onChange={this.onSearch}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    ]);
  }
}

export default App;
