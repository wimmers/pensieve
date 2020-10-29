import React, { Component } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import style from './graph_style.js'

export default class GraphView extends Component {

    state = {
        w: 0,
        h: 0,
        loading: true
    }

    container = React.createRef()

    runLayout() {
        this.cy.layout(this.layout).run()
    }


    async loadGraph() {
        if (process.env.REACT_APP_DEMO && !this.state.loading) {
            this.runLayout()
        }
        else {
            const path = process.env.REACT_APP_DEMO ? 'tutorial.json' : '/init'
            this.setState({ ...this.state, loading: true })
            const res = await fetch(path, { mode: 'no-cors' })
            const json = await res.json()
            this.setState({
                elements: json,
                loading: false,
                w: this.container.current.offsetWidth,
                h: this.container.current.offsetHeight
            })
            this.runLayout()
            this.setUpListeners()
        }
    }


    componentDidMount() {
        this.loadGraph()
    }

    id_counter = 0

    addNodeFromEvent = event => {
        const pos = event.position
        const id = 'new_' + this.id_counter
        const label = "Node " + this.id_counter++
        const data = { data: { id: id, label: label }, position: pos }
        const node = this.cy.add(data).select()
        return node
    }

    addEdge = (source, target, style, label = undefined) => {
        this.cy.add({
            group: 'edges',
            data: {
                source: source,
                target: target,
                style: style,
                label: label
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
            this.props.onSelectNode(event.target)
        })
        this.cy.on('unselect', 'node', (event) => {
            this.props.onDeselectNode(event.target)
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
            <div ref={this.container} id="graphview-container">
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