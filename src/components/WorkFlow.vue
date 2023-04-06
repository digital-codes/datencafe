<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

import cytoscape from "cytoscape"

/*
https://github.com/cytoscape/cytoscape.js-edgehandles
https://github.com/iVis-at-Bilkent/cytoscape.js-context-menus
alternative:
https://github.com/cytoscape/cytoscape.js-cxtmenu
*/

// import extensions
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import edgehandles from 'cytoscape-edgehandles';
// register extensions
cytoscape.use(contextMenus);
cytoscape.use( edgehandles );


import type { ElementDefinition, Stylesheet } from 'cytoscape';
import type { Core, EventObject } from 'cytoscape';
import type { NodeSingular, EdgeSingular } from 'cytoscape';

import type { MenuOptions } from 'cytoscape-context-menus';

import { IonButton } from '@ionic/vue';

import { DataFrame, toJSON } from 'danfojs/dist/danfojs-browser/src';

// globals
import { Signals } from "../services/GlobalDefs"
import eventBus from '../services/eventBus';

// popover
import { popoverController } from '@ionic/vue';
import Popover from './PopOver.vue'; // test
import ImportPopover from './ImportPopover.vue';
import InputselPopover from './InputselPopover.vue';
import NodesPopover from "./NodesPopover.vue"

// --------------------
import nodeTypes from "../assets/nodes/nodeTypes.json"
import { DcNode } from "../classes/DcNode"
import { LinePlot } from "../classes/LinePlot"
import { BarPlot } from "../classes/BarPlot"
import { DataInfo } from "../classes/DataInfo"
import { RandomGen } from "../classes/RandomGen"
import { nodeFactory } from "../services/NodeFactory"

// --------------------



const props = defineProps<{ msg: string }>()

const emit = defineEmits(["addViz","delViz"])

const count = ref(0)
const theFlow = ref(null)
const cy = ref()

const ww = ref(800)
const wh = ref(400)
const flowWrap = ref()
const flowLoaded = ref(false)

const ctl = ref()
const popBtn = ref()

const popover = ref({})
const inputselPop = ref({})

// next node/edge continuosly increase
const nextNode = ref(1)
const nextEdge = ref(1)


const elements: ElementDefinition[] = [ // list of graph elements to start with
  { // node a
    group: 'nodes', 
    //data: { id: 'a', name:"a", type:{"name":"t1","shp":"square","bd":"#f00", "img":"url('/img/icons-bordered/cloud-arrow-down.png')"} },  
    data: { id: 'a', name:"a", "ports":{"A":false}, type:{"name":"t1","shp":"square","bd":"#f00", "img":"url('/img/widgets/CSVFile.png')"} },  
    position: {x:10, y:10},
  },
  /*
  { // node b
    group: 'nodes', 
    data: { id: 'b', name:"b", "ports":{"A":false}, type:{"name":"t3","shp":"roundrectangle","bd":"#f00", "img":"url('/img/widgets/LinePlot.png')"} }, 
    position: {x:250, y:100},
  },
  { // node c
    group: 'nodes', 
    data: { id: 'c', name:"c", "ports":{"A":false, "B":false},  type:{"name":"t2","shp":"roundrectangle","bd":"#0f0", "img":"url('/img/widgets/Save.png')"}  },
    position: {x:130, y:150},
  },
  { // edge ab
    group: 'edges', 
    data: { id: 'ab', source: 'a', target: 'b' }
  },
  { // edge ac
    group: 'edges', 
    data: { id: 'ac', source: 'a', target: 'c', type: "e1" }
  },
  { // edge bc
    group: 'edges', 
    data: { id: 'bc', source: 'b', target: 'c', type: "e2" }
  }
  */
]

// see https://stackoverflow.com/questions/58136352/cytoscape-js-position-label-text-on-top-of-edge

const style: Stylesheet[] = [ // the stylesheet for the graph
{
    selector: 'node[name]',
    style: {
      'label': 'data(name)',
      "text-valign": "bottom",
      "text-halign": "center",    
        'background-fit': 'contain',
        'background-color': '#fff',
        'shape': 'circle',
        'width': '30px',
        'height': '30px',
        'border-width': '2px',
        'border-color': '#000'
      }    
  },
  /* warnung during new edges
  {
    selector: 'node[type]',
    style: {
      "shape":"data(type.shp)",
      'border-color': 'data(type.bd)',
      'background-image': 'data(type.img)',
    }
  },
  */
  {
    selector: 'node[type.shp]',
    style: {
      "shape":"data(type.shp)",
    }
  },
  {
    selector: 'node[type.bd]',
    style: {
      'border-color': 'data(type.bd)',
    }
  },
  {
    selector: 'node[type.img]',
    style: {
      'background-image': 'data(type.img)',
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 3,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
    }
  },
  {
    // special selector if object has data attribute "type"
    selector: 'edge[type]',
    style: {
      'label': 'data(type)',
      "font-size":"10px",
      "text-rotation": "autorotate",
        "text-margin-x": "0px",
        "text-margin-y": "0px" 
      }
  },
  {
    //selector: 'edge[type].dark',
    selector: 'edge[dark]',
    style: {
      "color":"#f88",
      "background-color":"#000",
      }
  },
  // edge extension
  {
    selector: '.eh-preview',
    style: {
      "opacity":1, 
      'background-color': 'red',
      'line-color': 'red',
      'target-arrow-color': 'blue',
      'source-arrow-color': 'red'
    }
  },    
  {
    selector: '.eh-ghost-edge',
    style: {
      "opacity":0,
      'background-color': 'green',
      'line-color': 'green',
      'target-arrow-color': 'blue',
      'source-arrow-color': 'red'
    }
  },    
  {
    selector: '.eh-source',
    style: {
      'border-width': 2,
      'border-color': 'red'
    }
  },
  {
    selector: '.eh-target',
    style: {
      'border-width': 2,
      'border-color': 'blue'
    }
  },
]

/*
const layout = {
  name: 'cose',
}
*/
const layout = {
  name: 'preset',
}

// edge handles
const eh = ref()

// context menu

const ctxMenu = ref()

const ctxOptions = {
    // Customize event to bring up the context menu
    // Possible options https://js.cytoscape.org/#events/user-input-device-events
    evtType: 'cxttap',
    // List of initial menu items
    // A menu item must have either onClickFunction or submenu or both
    menuItems: [
      {
      id: 'n-remove',
      content: 'Remove',
      tooltipText: 'Remove selected nodes',
      selector: 'node',
      onClickFunction: (event: EventObject) => {
        const { target } = event;
        console.log("Remove node:",target)
        cy.value.remove(target);
        const instance = target.data("instance")
        if (instance.display) {
          emit("delViz",instance.id)
        }
      },
      disabled: false
    },
    {
      id: 'edge1',
      content: 'Edge1',
      tooltipText: 'Start edge 1',
      selector: 'node',
      onClickFunction: async (event: EventObject) => {
        const { target } = event;
        //console.log("Start edge on:",target, target._private.data.id)
        cy.value.edgehandles('enable').disableDrawMode();
        const nd = await cy.value.getElementById(target.data("id"))
        nd.data("edge","e1") // set a source type
        //console.log("Node:",nd)
        cy.value.edgehandles().start(nd)
      },
      disabled: false
    },
    {
      id: 'edge2',
      content: 'Edge2',
      tooltipText: 'Start edge 2',
      selector: 'node',
      onClickFunction: async (event: EventObject) => {
        const { target } = event;
        //console.log("Start edge on:",target, target._private.data.id)
        cy.value.edgehandles('enable').disableDrawMode();
        const nd = await cy.value.getElementById(target.data("id"))
        nd.data("edge","e2") // set a source type
        //console.log("Node:",nd)
        cy.value.edgehandles().start(nd)
      },
      disabled: false
    },
    {
      id: 'e-remove',
      content: 'Remove',
      tooltipText: 'Remove selected edges',
      selector: 'edge',
      onClickFunction: (event: EventObject) => {
        const { target } = event;
        console.log("Remove edge:",target)
        cy.value.remove(target);
      },
      disabled: false
    },
    // should work on background click but doesn't
    /* */
    {
      id: 'add-node',
      content: 'add node',
      tooltipText: 'add node',
      selector: "node,edge",
      //image: {src: "assets/add.svg", width: 12, height: 12, x: 6, y: 4},
      coreAsWell: false,
      onClickFunction: async function (event?: EventObject) {
        console.log("Add node")
        const nodeType = await openNodeSel()
        console.log("NodeType from add node",nodeType)
        if (nodeType != "") {
          console.log("Type selected:",nodeType)
          console.log("Type:",nodeTypes[nodeType])
          // properties
          const nodeIcon = nodeTypes[nodeType].thumb
          const pos = event.position || event.cyPosition;
          const newId = "N" + String(nextNode.value++)
          const data = {
            //group: 'nodes',
            id:newId,
          };
          // add node
          const newNode = await cy.value.add({
            data: data,
            position: {
              x: pos.x + 20,
              y: pos.y + 5
            }
          })
          // create class instance
          try {
            const instance = await nodeFactory(newId,nodeType)
            // get ports and edges from instance
            const ports = {}
            instance.ports.forEach(p => {
              ports[p] = false
            });
            console.log("Ports:",ports)
            // we don't use edges yet ...
            const edges = {}
            instance.edges.forEach(e => {
              edges[e] = false
            });
            console.log("Edges:",edges)
            // set data
            const nodeData = {
              "name":newId,
              "ports":ports,
              "instance":{
                "id":instance.id,
                "name":instance.name,
                "type":instance.type,
                "display":instance.display | false
              },
              "type":{
                "name":nodeType,
                "shp":"circle",
                "bd":"#f00", 
                "img":"url('" + nodeIcon + "')"
              }
            }
            newNode.data(nodeData)
            console.log("New node:", newNode.data())
            //console.log("After add node:",JSON.stringify(cy.value.json()))
            // check if we need to create a new diagram element 
            if (instance.display) {
              emit("addViz",nodeData.instance)
            } else {
              console.log("No display on ",nodeData.instance)
            }
          } catch (err) {
            alert("Invalid instance:" + err.message)
            return
          }
        } else {
          console.log("Cancelled. Removing:")
        }
      }
    },
    /* */    
    ],
    // css classes that menu items will have
    menuItemClasses: [
      "ctx-item"
      // add class names to this list
    ],
    // css classes that context menu will have
    contextMenuClasses: [
      "ctx-menu"
      // add class names to this list
    ],
    // Indicates that the menu item has a submenu. If not provided default one will be used
    //submenuIndicator: { src: '/submenu-indicator-default.svg', width: 12, height: 12 }
    submenuIndicator: { src: "/assets/icon/arrow-right.svg", width: 12, height: 12 }
  };

const edgeOptions = {
  edgeParams: function( sourceNode: NodeSingular, targetNode: NodeSingular ){
    console.log("eparms")
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    return {};
  },
    hoverDelay: 150, // time spent hovering over a target node before it is considered selected
    snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
    loopAllowed: false,
    snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
    snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
    noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
    disableBrowserGestures: true // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
     
}

const extraItem = {
      id: 'n-extra',
      content: 'Extra',
      tooltipText: 'Extra',
      selector: 'node',
      onClickFunction: (event: EventObject) => {
        const { target } = event;
        console.log("Extra on :",target)
      },
      disabled: false
}

watch(
  flowLoaded,(a) => {
    console.log("loaded:",a)
    if (a) {
      console.log("Next")
      /* 
       await nextTick() // not enough
      flowInit()
      */
      setTimeout(flowInit,100)
    }
  }
)


//onMounted(async () => {
async function flowInit  ()  {
    console.log("CTR:",theFlow.value)
    cy.value = await cytoscape({
      container: theFlow.value,
      layout:layout,
      style:style,
      elements:elements,
      // initial viewport state:
      zoom: 1,
      pan: { x: 0, y: 0 },
      /*
      panningEnabled: {
        // set the panning step to 100 pixels
        step: 10
      },
      */
      wheelSensitivity: 0.2,
    })
    if (!cy.value) {
      console.log("cy falied")
    } else {
      await cy.value.center()
      await cy.value.fit()
      // edge handles
      eh.value = await cy.value.edgehandles( edgeOptions )
      // context menu
      ctxMenu.value = await cy.value.contextMenus(ctxOptions)
      // append. works ... usable via show/hide 
      // await ctxMenu.value.appendMenuItem(extraItem)
      // 
      const j = await cy.value.json()
      console.log("JSON:",j)
  
    // add callbacks
    // NB: adding edges will cause temporary edge and node-add/remove event in addition to
    // the final add  
    cy.value.on('select', 'node', function(event: EventObject) {
      const node = event.target;
      console.log('Node ' + node.id() + ' was selected');
    });

    cy.value.on('unselect', 'node', function(event: EventObject) {
      const node = event.target;
      console.log('Node ' + node.id() + ' was deselected');
    });

    /*
    cy.value.on('ehhoverover', async function(event: EventObject, sourceNode: NodeSingular, targetNode: NodeSingular) {
      console.log(`Edge for target ${targetNode.id()}`);
      // check target type and possibly have input type selected via popover
      //openInputSel()
    });
    */

    // When an edge is successfully created, log the event to the console
    cy.value.on('ehcomplete', async (event: EventObject, sourceNode: NodeSingular, targetNode: NodeSingular, addedEdge: EdgeSingular) => {
      console.log(`Edge created from ${sourceNode.id()} to ${targetNode.id()}`);
      // check valid elements first
      const t = await cy.value.getElementById(targetNode.data("id"))
      if (t.id() === undefined) {
        console.log("Edge cancelled1")
        return
      }
      // we have stored the edge type in the source node. copy to edge type
      const e = await cy.value.getElementById(addedEdge.data("id"))
      if (e.id() === undefined) {
        console.log("Edge cancelled2")
        return
      }
      const s = await cy.value.getElementById(sourceNode.data("id"))
      if (s.id() === undefined) {
        console.log("Edge cancelled3")
        return
      }
      // check ports, init with first item
      let port = {data:Object.keys(t.data("ports"))[0]}
      let block = false
      const tp = t.data("ports")
      //
      const portsAvail = Object.keys(tp).filter(key => !tp[key])
      console.log("Available ports:",portsAvail)
      if (portsAvail == 0) {
        console.log("No free ports")
        block = true
      } else {
        // check popover
        if (Object.keys(tp).length > 1) {
          port = await openInputSel(tp)
          console.log("Port:",port)
          if (port.role != "button") {
            // FIXME throws error on removing edge
            // doint later with block seems to be fine
            console.log("Selection cancelled")
            block = true
            //await addedEdge.remove()
          } 
        }
        // add edge name
        console.log("from ",s.data("name"), " to ",t.data("name"),", port: ",port.data)
        await e.data("type",s.data("edge") + "-" + port.data)
        await s.removeData("edge")
      }

      // test blocking
      /* 
      if (t.id() == "b") {
        block = true
      }
       */
      if (!block) {
        // update node data
        t.data("ports")[port.data] = true
        // update edge data
        await e.data("port",port.data)
      } else {
        console.log("Removing edge",e.id())
        if (e.id() !== undefined) {
          try {
            console.log("NOW")
            await e.remove()
            //await addedEdge.remove()
            console.log("removed ...")
          } catch (err) {
            console.log("remove failed:",err.message)
          }
        }
      }
    });

    cy.value.on('cxttap', 'node', function(event?: EventObject) {
      const node = event.target;
      console.log('Node ' + node.id() + ' was right clicked');
      if (node.id() == "a")
        ctxMenu.value.showMenuItem("edge2")
      else 
        ctxMenu.value.hideMenuItem("edge2")
    });

    cy.value.on('dblclick', function(event: EventObject) {
      const pos = event.position || event.cyPosition;
      console.log('dblclick at ',pos);
      popBtn.value.$el.click()
    });

    // remove handlers. remove edge will be triggered on delete node with edges
    cy.value.on("remove","node",function(event: EventObject){
      console.log("Remove node event:",event.target.data())
    })
    cy.value.on("remove","edge",function(event: EventObject){
      console.log("Remove edge event:",event.target.data())
      // get port + target parameters from edge:
      const dt = event.target.data()
      console.log("DT:",dt)
      const port = dt.port
      const dest = dt.target 
      console.log("Port,target:",port,dest) 
      if ((dest == undefined) || (port === undefined)) return
      // get target node
      const destNode = cy.value.getElementById(dest)
      if ((destNode == undefined) || (destNode.data() === undefined)) return
      console.log("tnode:",destNode,destNode.data(),destNode.data().ports[port])
      // remove port assignment
      destNode.data().ports[port] = false
      console.log("tnode port new:",destNode.data().ports[port])
      // 


    })
  }
}

  onMounted(() =>  {
    ww.value = window.innerWidth
    wh.value = window.innerHeight
    console.log("ww,wh",ww.value,wh.value)
    if (!flowWrap.value.style) flowWrap.value.style = {}
    flowWrap.value.style.width = "100%" //String(ww.value) + "px"
    flowWrap.value.style.height = String(wh.value * .7) + "px"
    flowLoaded.value = true
    //flowWrap.value.addEventListener("sel",()=>{console.log("sel")})
    //addEventListener("sel",flowWrap.value,(e)=>{console.log("sel",e)})
    /*
    eventBus.on('selected', (data) => {
      console.log("on selected:",data)
      // test if we can do something else while popover is active ..
      const clrs = ["#f00","#f0f","#ff0","#00f"]
      ctl.value.style.background = clrs[Math.floor(Math.random()*clrs.length)];
      // works. background changes
      // allow to close on specific return value. only if open
      if (popover.value.open) {
        if (data == "default")
          popover.value.dismiss(data,"123")
      }
    });
    */
    eventBus.on('importSelection', (data) => {
      console.log("on importSelection:",data)
      // test if we can do something else while popover is active ..
      const clrs = ["#f00","#f0f","#ff0","#00f"]
      ctl.value.style.background = clrs[Math.floor(Math.random()*clrs.length)];
      // works. background changes
      // allow to close on specific return value. only if open
      if (popover.value.open) {
        if (data.close == true)
          popover.value.dismiss(data,"button")
      }
    });
    eventBus.on('inputSelection', (data) => {
      console.log("on inputSelection:",data)
      // test if we can do something else while popover is active ..
      // allow to close on specific return value. only if open
      if (popover.value.open) {
        popover.value.dismiss(data,"button")
      }
    });
    eventBus.on('nodeSelection', (data) => {
      console.log("on nodeSelection:",data)
      // test if we can do something else while popover is active ..
      // allow to close on specific return value. only if open
      if (popover.value.open) {
        popover.value.dismiss(data,"button")
      }
    });
  })
  
const ctlClick = async () => {
  console.log("clk")
  const j = await cy.value.json()
  console.log("JSON:",JSON.stringify(j))
  createEvent()
}

//const openInputSel = async (ev: Event) => {
  const openInputSel = async (ports) => {
  popover.value = await popoverController.create({
      component: InputselPopover,
      //event: ev,
      size: "auto",
      side:"right",
      alignment:"start",
      showBackdrop: true,
      backdropDismiss: true, // error when enabling dismiss
      dismissOnSelect: true,
      reference: "trigger", // event or trigger
      componentProps: { // Popover props
          msg:"Select Input",
          signal: "inputSelection",
          ports: ports
        }
    })
    await popover.value.present();
    popover.value.open = true
    const x = await popover.value.onDidDismiss();
    console.log("Dismiss: ",x)
    popover.value.open = false
    return x
}

const openNodeSel = async () => {
  popover.value = await popoverController.create({
      component: NodesPopover,
      //event: ev,
      size: "auto",
      side:"right",
      alignment:"start",
      showBackdrop: true,
      backdropDismiss: true, 
      dismissOnSelect: false,
      reference: "trigger", // event or trigger
      componentProps: { // Popover props
          msg:"Select Input",
          signal: "nodeSelection"
        }
    })
    popover.value.open = true
    await popover.value.present();
    const x = await popover.value.onDidDismiss();
    console.log(x)
    console.log("Dismiss: ",x)
    popover.value.open = false
    if (x.role == "button") {
      const nt = x.data
      console.log("Type from popup:",nt)
      // find node
      return nt
    } else {
      return ""
    }
}

const openPopover = async (ev: Event) => {
  // create dummy dataframe for test
  const df = await new DataFrame({
    "x1": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5,1, 2, 3, 4, 5],
    "y1": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5,1, 2, 3, 4, 5],
    "z1": ["asa","dw","ddddW","y","","asa","dw","ddddW","y","","asa","dw","ddddW","y",""],
    "x2": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5,1, 2, 3, 4, 5],
    "y2": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5,1, 2, 3, 4, 5],
    "z2": ["asa","dw","ddddW","y","","asa","dw","ddddW","y","","asa","dw","ddddW","y",""]
      }
    )
    /* ************************************* */
    // test json to/ftom
    const dfj = await toJSON(df)
    console.log("JSON:",dfj)
    const df2 = await new DataFrame(dfj)
    df2.print(5)
    /* ************************************* */

    /* */
    popover.value = await popoverController.create({
      component: ImportPopover,
      event: ev,
      size: "auto",
      side:"right",
      alignment:"start",
      showBackdrop: false,
      backdropDismiss: false,
      dismissOnSelect: false,
      reference: "trigger", // event or trigger
      componentProps: { // Popover props
          msg:"Select Option",
          dt: df,
        }
    });
    /* */
    /* 
  popover.value = await popoverController.create({
      component: Popover,
      event: ev,
      size: "auto",
      side:"right",
      alignment:"start",
      showBackdrop: false,
      backdropDismiss: true,
      dismissOnSelect: false,
      reference: "trigger", // event or trigger
      componentProps: { // Popover props
          msg:"Select Option",
          dt: ["default","one","two","three"],
        }
    });
     */
    await popover.value.present();
    popover.value.open = true
    await popover.value.onDidDismiss();
    popover.value.open = false
  }

const createEvent = async () => {
  console.log("Create event")
  /* we can create an event with position, which will be used
  ** when reference = event
  */
  /*
  const event = new MouseEvent("click", {
    clientX: 500,
    clientY: 500
  });
  openPopover(event)
  */
  await openNodeSel()


  // or we just use the default from the popover button with reference = trigger
  /*
  console.log("btn",popBtn.value)
  popBtn.value.$el.click()
  */
}


</script>

<template>

  <div ref="flowWrap" class="wrap">
    <div ref="ctl" class="ctl">
      <ion-button @click='ctlClick'>Clk</ion-button>
      <ion-button ref="popBtn" @click="openPopover">Click Me</ion-button>
      <NodesPopover/>
    </div>
    <div class="flow" ref="theFlow"></div>
  </div>

</template>

<style scoped>
.wrap {
  position:relative;
  /* dark mode not working yet, set light BG */
  background-color: #fff;
}
.ctl {
  position:absolute;
  top:0;
  left:300px;
  z-index: 100;
  width:50px;
  height:50px;
  background:#cc0;
  display: flex;
  align-items:center;
  justify-content: center;


}
.flow {
  width:100%;
  min-width: 300px;
  height: 100%;
  min-height:300px;
  display: block;
}
.node {
  color: #f00;
}
.edge {
  color: #00f;
}

.t1 {
  display:none;
}
</style>

<style>
.t1 {
  display:none;
}
.flow canvas {
  left:0;
}

.ctx-menu {
  background-color :#422;
  padding:3px;
}

.ctx-item {
  background-color :#f0f;
  padding:3px;
  margin:3px;
}

</style>
