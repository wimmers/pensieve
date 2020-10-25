import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import GraphView from './GraphView';
import MarkdownEditor from '@uiw/react-markdown-editor';

class App extends Component {
  state = {
    selected: undefined
  }

  graphView = React.createRef();

  onSelectNode = data => {
    this.setState({ ...this.state, selected: data })
  }

  updateMarkdown = (_editor, _data, value) => {
    const cy = this.graphView.current.cy
    cy.$(`[id = '${this.state.selected.id}']`).json({ "data": { "note": value } })
  }

  render() {
    const state = this.state
    return ([
      <Container fluid>
        <div className="graphview" id="graphview-container">
          <GraphView onSelectNode={this.onSelectNode} ref={this.graphView} />
        </div>
      </Container>,
      <Container fluid className="p-3">
        <MarkdownEditor
          value={state.selected ? state.selected.note : null}
          onChange={this.updateMarkdown}
          visible={false}
          height={500}
        />
      </Container>
    ]);
  }
}

export default App;
