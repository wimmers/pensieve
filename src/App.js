import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GraphView from './GraphView';
import MarkdownEditor from '@uiw/react-markdown-editor';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/theme/monokai.css';

class App extends Component {
  state = {
    selected: undefined
  }

  graphView = React.createRef();

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
    return ([
      <Container fluid>
        <div className="graphview" id="graphview-container">
          <GraphView
            onSelectNode={this.onSelectNode}
            onDeselectNode={this.onDeselectNode}
            ref={this.graphView}
            />
        </div>
      </Container>,
      <Container fluid className="p-3">
        <Row>
          <Col xs="12" lg="8" xl="9">
            <MarkdownEditor
              value={state.selected ? state.selected.note : null}
              onChange={this.updateMarkdown}
              visible={false}
              height={500}
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
