import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import GraphView from './GraphView';
import MarkdownEditor from '@uiw/react-markdown-editor';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/theme/monokai.css';

const empty_info = {
  "files": null,
  "deleted": null,
  "favorited": null,
  "pinned": null,
  "tags": null,
  "name": null,
  "created": null,
  "modified": null
}

class App extends Component {
  state = {
    selected: undefined,
    adding: null,
    linking: null
  }

  graphView = React.createRef();

  markdownEditor = React.createRef()

  onAddNote = data => {
    this.setState({ ...this.state, adding: "note" })
  }

  onAddFrom = data => {
    this.setState({ ...this.state, linking: "from" })
  }

  onAddCrossref = data => {
    this.setState({ ...this.state, linking: "crossref" })
  }

  unsetFlags = () => {
    this.setState({ ...this.state, adding: null, linking: null })
  }

  insertTextAtCursor(text) {
    const editor = this.markdownEditor.current.CodeMirror.editor
    console.log(editor)
    var doc = editor.getDoc();
    var cursor = doc.getCursor();
    doc.replaceRange(text, cursor);
  }

  onTapNode = node => {
    const state = this.state
    if (state.linking && state.selected) {
      const style = state.linking === 'crossref' ?
        "dashed" :
        "solid"
      this.graphView.current.addEdge(state.selected.id, node.data('id'), style)
      const targetName = node.data('label')
      var text = `[#${state.linking}](note/${targetName}.md)`
      this.insertTextAtCursor(text)
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
      const info = { ...empty_info, name: name }
      node.json({ data: { info: info, label: name } })
    }
    this.unsetFlags()
  }

  onRefresh = data => {
    this.graphView.current.runLayout()
  }

  onSelectNode = data => {
    this.setState({ ...this.state, selected: data })
  }

  onDeselectNode = data => {
    this.setState({ ...this.state, selected: null })
  }

  updateMarkdown = (_editor, _data, value) => {
    const state = this.state
    if (!state.selected)
      return
    const cy = this.graphView.current.cy
    cy.$(`[id = '${state.selected.id}']`).json({ data: { note: value } })
  }

  updateJson = (editor) => {
    const state = this.state
    if (!state.selected)
      return
    try {
      const code = editor.getValue()
      const info = JSON.parse(code)
      const cy = this.graphView.current.cy
      const data = { data: { info: info, label: info['name'] } }
      cy.$(`[id = '${state.selected.id}']`).json(data)
    }
    catch (e) {
      if (e.name !== "SyntaxError")
        throw e
    }
  }

  render() {
    const state = this.state
    const linkDisabled = !state.selected
    return ([
      <Container fluid>
        <div className="graphview" id="graphview-container">
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
          <Button className="mb-1" variant="danger" onClick={this.onRefresh}>
            refresh
          </Button>
        </div>
        <Row>
          <Col xs="12" lg="8" xl="9">
            <MarkdownEditor
              value={state.selected ? state.selected.note : null}
              onChange={this.updateMarkdown}
              visible={false}
              height={500}
              ref={this.markdownEditor}
            />
          </Col>
          <Col xs="12" lg="4" xl="3">
            <CodeMirror
              value={state.selected ? JSON.stringify(state.selected.info, null, 4) : ""}
              onChange={this.updateJson}
              options={{
                theme: 'monokai',
                tabSize: 2,
                mode: 'json',
              }}
            />
          </Col>
        </Row>
      </Container>
    ]);
  }
}

export default App;
