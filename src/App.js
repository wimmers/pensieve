import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import GraphView from './GraphView';

class App extends Component {
  state = {
    "text": undefined
  }

  on_select_node = data => {
    this.setState({ ...this.state, "text": data["note"] })
  }

  render() {
    return ([
      <Container fluid>
        <div className="graphview" id="graphview-container">
          <GraphView on_select_node={this.on_select_node} />
        </div>
      </Container>,
      <Container fluid className="p-3">
        <div>
          <p>{this.state.text}</p>
        </div>
      </Container>
    ]);
  }
}

export default App;
