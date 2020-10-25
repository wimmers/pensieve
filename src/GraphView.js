import React, { Component } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import style from './graph_style.js'

export default class GraphView extends Component {

    state = {
        w: 0,
        h: 0,
        loading: true
    }

    runLayout() {
        this.cy.layout(this.layout).run()
    }

    componentDidMount() {
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
                this.runLayout()
            })
    }

    id_counter = 0

    addNodeFromEvent = event => {
        const pos = event.position
        const id = 'new_' + this.id_counter
        const label = "Node " + this.id_counter++
        const new_node = { data: { id: id, label: label }, position: pos }
        this.cy.add(new_node).select()
        return id
    }

    addEdge = (source, target, style) => {
        this.cy.add({
            group: 'edges',
            data: {
                source: source,
                target: target,
                style: style
            }
        })
    }

    setUpListeners = () => {
        this.cy.on('tap', 'node', (event) => {
            const node = event.target
            node.selectify()
            const stopSelection = this.props.onTapNode(node)
            if (stopSelection) {
                node.unselectify()
            }
        })
        this.cy.on('tap', (event) => {
            if (event.target === this.cy) {
                this.props.onTapBackground(event)
            }
        })
        this.cy.on('select', 'edge', event => {
            this.props.onSelectEdge(event.target)
        })
        this.cy.on('select', 'node', (event) => {
            this.props.onSelectNode(event.target.data())
        })
        this.cy.on('unselect', 'node', (event) => {
            this.props.onDeselectNode(event.target.data())
        })
    }


    layout = {
        name: 'cose',
        nodeDimensionsIncludeLabels: true,
        componentSpacing: 100
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