export default
    [
        {
            selector: 'node',
            style: {
                'label': 'data(label)',
                "text-wrap": "wrap",
                'text-valign': 'center',
                "text-max-width": "90px",
                "font-size": "12px",
                "text-valign": "center",
                "text-halign": "center",
                "background-color": "#555",
                "text-outline-color": "#555",
                "text-outline-width": "2px",
                "color": "#fff",
                "overlay-padding": "6px",
                "z-index": "10",
                'width': "100px",
                'height': "50px",
                "shape": "round-rectangle"
            }
        },

        {
            selector: 'node[group="tag"]',
            style: {
                "shape": "round-pentagon",
                "height": "75px",
                "background-color": "#515",
                "text-outline-color": "#515",
            }
        },

        {
            "selector": "node:selected",
            "style": {
                "border-width": "6px",
                "border-color": "#AAD8FF",
                "border-opacity": "0.5"
            }
        },

        {
            selector: 'edge',
            style: {
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'line-style': 'data(style)'
            }
        }
    ]