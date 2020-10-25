import React, { Component } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import style from './graph_style.js'

export default class GraphView extends Component {

    state = {
        w: 0,
        h: 0,
        // elements: [
        //     { data: { id: 'one', label: 'Node very large 1 2' }, position: { x: 100, y: 50 } },
        //     { data: { id: 'two', label: 'Node 2' }, position: { x: 200, y: 50 } },
        //     { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
        // ],
        loading: true
    }

    componentDidMount() {
        // this.setState({
        //     w: window.innerWidth,
        //     h: window.innerHeight
        // })
        fetch('notes.json', { mode: 'no-cors' })
            .then(res => { return res.json() })
            .then(json => {
                this.setState({
                    elements: json,
                    loading: false,
                    w: this.container.offsetWidth,
                    h: 800
                });
                this.setUpListeners();
                this.cy.layout(this.layout).run()
            })
    }

    id_counter = 3

    keys = []

    key_down = (e) => {
        this.keys[e.key] = true
    }

    key_up = (e) => {
        this.keys[e.key] = false
    }

    setUpListeners = () => {
        this.cy.on('tap', 'node', (event) => {
            // Add new edge
            if (this.keys["Control"]) {
                const nds = this.cy.elements(":selected");
                if (nds.length > 0 && nds[0]) {
                    const source = nds[0].data('id')
                    const target = event.target.data('id')
                    this.cy.add({
                        group: 'edges',
                        data: {
                            source: source,
                            target: target
                        }
                    });
                    // this.cy.layout(this.layout).run()
                }
            }
            // Assume that node was selected
            this.props.onSelectNode(event.target.data())
        })
        this.cy.on('tap', (event) => {
            if (event.target === this.cy) {
                console.log(event.target)
                const pos = event.position
                const id = 'new_' + this.id_counter
                const label = "Node " + this.id_counter++
                const new_node = { data: { id: id, label: label }, position: pos }
                this.cy.add(new_node)
                // this.cy.layout(this.layout).run()
            }
        })
        window.addEventListener("keydown", this.key_down, false)
        window.addEventListener('keyup', this.key_up, false)
    }


    layout = {
        name: 'cose'
    }

    style = style

    render() {
        return (
            <div ref={el => (this.container = el)}>
                {this.state.loading ?
                    <p>Waiting for data to load!</p> :
                    <CytoscapeComponent
                        elements={this.state.elements}
                        style={{ width: this.state.w, height: this.state.h }}
                        stylesheet={this.style}
                        cy={(cy) => { this.cy = cy }}
                        boxSelectionEnabled={true}
                    />
                }
            </div>
        )
    }

}