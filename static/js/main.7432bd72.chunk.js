(this.webpackJsonppensieve=this.webpackJsonppensieve||[]).push([[0],{373:function(e,t,n){"use strict";n.r(t);var a=n(6),o=n(0),r=n.n(o),s=n(34),c=n.n(s),i=(n(61),n(16)),d=n.n(i),l=n(23),u=n(4),h=n(7),g=n(8),f=n(24),b=n(10),j=n(9),p=n(38),v=(n(63),n(36)),O=n(54),m=n(18),y=n(37),x=n(17),k=n(50),C=n.n(k),S=[{selector:"node",style:{"text-wrap":"wrap","text-max-width":"90px","font-size":"12px","text-valign":"center","text-halign":"center","background-color":"#555","text-outline-color":"#555","text-outline-width":"2px",color:"#fff","overlay-padding":"6px","z-index":"10",width:"100px",height:"50px",shape:"round-rectangle"}},{selector:"node[label]",style:{label:"data(label)"}},{selector:'node[group="tag"]',style:{shape:"round-pentagon",height:"75px","background-color":"#515","text-outline-color":"#515"}},{selector:"node:selected",style:{"border-width":"6px","border-color":"#AAD8FF","border-opacity":"0.5"}},{selector:"edge",style:{"curve-style":"bezier","target-arrow-shape":"triangle"}},{selector:"edge[style]",style:{"line-style":"data(style)"}}],w=function(e){Object(b.a)(n,e);var t=Object(j.a)(n);function n(){var e;Object(h.a)(this,n);for(var a=arguments.length,o=new Array(a),s=0;s<a;s++)o[s]=arguments[s];return(e=t.call.apply(t,[this].concat(o))).state={w:0,h:0,loading:!0},e.container=r.a.createRef(),e.id_counter=0,e.addNodeFromEvent=function(t){var n=t.position,a={data:{id:"new_"+e.id_counter,label:"Node "+e.id_counter++},position:n};return e.cy.add(a).select()},e.addEdge=function(t,n,a){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:void 0;e.cy.add({group:"edges",data:{source:t,target:n,style:a,label:o}})},e.setUpListeners=function(){e.cy.on("tap","node",(function(t){var n=t.target;n.selectify(),e.props.onTapNode(n)&&n.unselectify()})),e.cy.on("tap",(function(t){t.target===e.cy&&e.props.onTapBackground(t)})),e.cy.on("select","edge",(function(t){e.props.onSelectEdge(t.target)})),e.cy.on("select","node",(function(t){e.props.onSelectNode(t.target)})),e.cy.on("unselect","node",(function(t){e.props.onDeselectNode(t.target)}))},e.layout={name:"cose",nodeDimensionsIncludeLabels:!0,componentSpacing:100},e.style=S,e}return Object(g.a)(n,[{key:"runLayout",value:function(){this.cy.layout(this.layout).run()}},{key:"loadGraph",value:function(){var e=Object(l.a)(d.a.mark((function e(){var t,n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"tutorial.json",this.setState(Object(u.a)(Object(u.a)({},this.state),{},{loading:!0})),e.next=4,fetch("tutorial.json",{mode:"no-cors"});case 4:return t=e.sent,e.next=7,t.json();case 7:n=e.sent,this.setState({elements:n,loading:!1,w:this.container.current.offsetWidth,h:this.container.current.offsetHeight}),this.runLayout(),this.setUpListeners();case 11:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){this.loadGraph()}},{key:"render",value:function(){var e=this;return Object(a.jsx)("div",{ref:this.container,id:"graphview-container",children:this.state.loading?Object(a.jsx)("p",{children:"Waiting for data to load!"}):Object(a.jsx)(C.a,{elements:this.state.elements,style:{width:this.state.w,height:this.state.h},stylesheet:this.style,cy:function(t){e.cy=t},boxSelectionEnabled:!0})})}}]),n}(o.Component),N=n(55),T=n(53),A=n.n(T),E=function(e){for(var t=[],n=0;n<e.length;n++)t[n]=e[n].name;return t},F=function(e){var t=Object(o.useState)(e.tags?function(e){for(var t=[],n=0;n<e.length;n++)t[n]={id:n,name:e[n]};return t}(e.tags):[]),n=Object(p.a)(t,2),r=n[0],s=n[1];return Object(a.jsx)(A.a,{allowNew:!0,tags:r,onDelete:function(t){var n=r.slice(0);n.splice(t,1),s(n),e.onChangeTags(E(n))},onAddition:function(t){var n=[].concat(r,t);s(n),e.onChangeTags(E(n))}})},D=function(e){var t=Object(o.useState)(e.value),n=Object(p.a)(t,2),r=n[0],s=n[1];return Object(o.useEffect)((function(){var t=setTimeout((function(){e.onChange(r)}),300);return function(){return clearTimeout(t)}})),Object(a.jsx)(y.a.Control,{plaintext:!0,type:"text",value:r,onChange:function(e){return s(e.target.value)},className:"mb-2 title"})},L={attachments:null,deleted:null,favorited:null,pinned:null,tags:null,name:null,created:null,modified:null},V=function(e){Object(b.a)(n,e);var t=Object(j.a)(n);function n(e){var a;return Object(h.a)(this,n),(a=t.call(this,e)).state={selected:void 0,adding:null,linking:null,searchQuery:"",lastCursor:void 0},a.graphView=r.a.createRef(),a.markdownEditor=r.a.createRef(),a.sendJSON=function(e,t){return fetch(e,{mode:"no-cors",method:"POST",body:JSON.stringify(t),headers:{"Content-Type":"application/json"}})},a.sendAddNote=function(e){0},a.sendChangeNote=function(e){0},a.onAddNote=function(e){a.setState(Object(u.a)(Object(u.a)({},a.state),{},{adding:"note"}))},a.onAddFrom=function(e){a.setState(Object(u.a)(Object(u.a)({},a.state),{},{linking:"from"}))},a.onAddCrossref=function(e){a.setState(Object(u.a)(Object(u.a)({},a.state),{},{linking:"crossref"}))},a.onAddLink=function(e){a.setState(Object(u.a)(Object(u.a)({},a.state),{},{linking:"link"}))},a.unsetFlags=function(){a.setState(Object(u.a)(Object(u.a)({},a.state),{},{adding:null,linking:null}))},a.onTapNode=function(e){var t=a.state;if(t.linking&&t.selected){var n,o,r=e.data("label"),s="[#".concat(t.linking,"](@note/").concat(r,".md)"),c=s.length;switch(t.linking){case"from":n="solid",o=void 0;break;case"crossref":n="dashed",o=void 0;break;case"link":n="dotted",o="link",s="[](".concat(r,".md)"),c=1}return a.graphView.current.addEdge(t.selected.data("id"),e.data("id"),n,o),a.insertTextAtCursor(s,c),a.unsetFlags(),!0}return a.unsetFlags(),!1},a.onSelectEdge=function(e){a.unsetFlags()},a.onTapBackground=function(e){if("note"===a.state.adding){var t=a.graphView.current.addNodeFromEvent(e),n="Untitled",o=(new Date).toISOString(),r=Object(u.a)(Object(u.a)({},L),{},{name:n,created:o,modified:o});t.json({data:{info:r,label:n}}),a.sendAddNote(t.data())}a.unsetFlags()},a.onSelectNode=function(e){a.setState(Object(u.a)(Object(u.a)({},a.state),{},{selected:e}));var t=e.data("note")||"";a.markdownEditor.current.CodeMirror.editor.setValue(t)},a.onDeselectNode=function(e){a.setState(Object(u.a)(Object(u.a)({},a.state),{},{selected:null,lastCursor:null}))},a.updateAndSend=function(e){var t=a.state.selected;t.json(e),a.sendChangeNote(t.data())},a.updateMarkdown=function(e){var t=e.getDoc().getCursor();(t.sticky||0!==t.line||0!==t.ch)&&a.setState(Object(u.a)(Object(u.a)({},a.state),{},{lastCursor:t}));var n=a.state.selected;if(n){var o=e.getValue();if(o!==n.data("note")){var r=(new Date).toISOString(),s={data:{note:o,info:Object(u.a)(Object(u.a)({},n.data("info")),{},{modified:r})}};e.setValue(o),a.updateAndSend(s)}}},a.onChangeTags=function(e){var t=a.state.selected,n={data:{info:Object(u.a)(Object(u.a)({},t.data("info")),{},{tags:e})}};a.updateAndSend(n)},a.onChangeName=function(e){var t=a.state.selected,n={data:{info:Object(u.a)(Object(u.a)({},t.data("info")),{},{name:e}),label:e}};a.updateAndSend(n)},a.onSearch=function(e){var t=e.target.value;if(a.setState(Object(u.a)(Object(u.a)({},a.state),{},{searchQuery:t,selected:void 0})),t&&a.state.searchQuery!==t){var n=a.graphView.current,o=n.cy,r='node[label *= "'.concat(t,'"], node[note *= "').concat(t,'"]'),s=o.$(r);s=s.union(s.neighborhood());var c=o.elements().not(s);o.remove(c).length>0&&n.runLayout()}},a.onRefresh=a.onRefresh.bind(Object(f.a)(a)),a}return Object(g.a)(n,[{key:"insertTextAtCursor",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,n=this.markdownEditor.current.CodeMirror.editor,a=n.getDoc(),o=this.state.lastCursor||a.getCursor();a.replaceRange(e,o),t&&n.setCursor(o.line,o.ch+t),n.focus()}},{key:"onRefresh",value:function(){var e=Object(l.a)(d.a.mark((function e(t){var n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n=this.state).selected){e.next=4;break}return e.next=4,this.sendChangeNote(n.selected.data());case 4:this.graphView.current.loadGraph(),this.setState(Object(u.a)(Object(u.a)({},this.state),{},{searchQuery:""}));case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state,t=e.selected,n=!t;return[Object(a.jsx)(v.a,{fluid:!0,children:Object(a.jsx)("div",{className:"graphview",children:Object(a.jsx)(w,{onSelectEdge:this.onSelectEdge,onSelectNode:this.onSelectNode,onDeselectNode:this.onDeselectNode,onTapBackground:this.onTapBackground,onTapNode:this.onTapNode,ref:this.graphView})})}),Object(a.jsxs)(v.a,{fluid:!0,className:"p-3",children:[Object(a.jsxs)("div",{className:"mb-1",children:[Object(a.jsx)(x.a,{className:"mb-1",variant:"primary",onClick:this.onAddNote,children:"+ note"})," ",Object(a.jsx)(x.a,{className:"mb-1",variant:"secondary",onClick:this.onAddFrom,disabled:n,children:"+ from"})," ",Object(a.jsx)(x.a,{className:"mb-1",variant:"dark",onClick:this.onAddCrossref,disabled:n,children:"+ crossref"})," ",Object(a.jsx)(x.a,{className:"mb-1",variant:"light",onClick:this.onAddLink,disabled:n,children:"+ link"})," ",Object(a.jsx)(x.a,{className:"mb-1",variant:"danger",onClick:this.onRefresh,children:"refresh"})]}),Object(a.jsxs)(O.a,{children:[Object(a.jsx)(m.a,{xs:"12",lg:"8",xl:"9",className:"mb-2",children:Object(a.jsx)(N.a,{onBlur:this.updateMarkdown,visible:!1,height:500,ref:this.markdownEditor})}),Object(a.jsxs)(m.a,{xs:"12",lg:"4",xl:"3",children:[t&&t.data("info")?Object(a.jsxs)("div",{className:"mb-2",children:[Object(a.jsx)(D,{value:t.data("label"),onChange:this.onChangeName})," ",Object(a.jsx)(F,{tags:t.data("info").tags,onChangeTags:this.onChangeTags})]}):"",Object(a.jsx)("div",{children:Object(a.jsxs)("div",{children:[Object(a.jsx)("span",{children:"Search:"}),Object(a.jsx)(y.a.Control,{type:"text",value:e.searchQuery,onChange:this.onSearch})]})})]})]})]})]}}]),n}(o.Component),R=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,374)).then((function(t){var n=t.getCLS,a=t.getFID,o=t.getFCP,r=t.getLCP,s=t.getTTFB;n(e),a(e),o(e),r(e),s(e)}))};n(372);c.a.render(Object(a.jsx)(r.a.StrictMode,{children:Object(a.jsx)(V,{})}),document.getElementById("root")),R()},61:function(e,t,n){},63:function(e,t,n){}},[[373,1,2]]]);
//# sourceMappingURL=main.7432bd72.chunk.js.map