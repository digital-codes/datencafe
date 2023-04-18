<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'

import cytoscape from "cytoscape"

import { marked } from "marked"

/*
https://github.com/cytoscape/cytoscape.js-edgehandles
https://github.com/iVis-at-Bilkent/cytoscape.js-context-menus
alternative:
https://github.com/cytoscape/cytoscape.js-cxtmenu
*/

// import extensions
// no context menu!
import edgehandles from 'cytoscape-edgehandles';
// register extensions
cytoscape.use(edgehandles);


import type { ElementDefinition, Stylesheet } from 'cytoscape';
import type { Core, EventObject } from 'cytoscape';
import type { NodeSingular, EdgeSingular } from 'cytoscape';

import type { MenuOptions } from 'cytoscape-context-menus';

import { IonButton } from '@ionic/vue';

import { DataFrame, toJSON } from 'danfojs/dist/danfojs-browser/src';

// globals
import { Signals, Version } from "@/services/GlobalDefs"
import eventBus from '@/services/eventBus';

// provider/subscriber
import { PubStore } from '@/services/PubStore'
const providers = PubStore()

// user store
import { UserStore, UserInfo } from '@/services/UserStore'
const userStore = UserStore()

// delay timer
import { DelayTimer } from "@/services/DelayTimer"

// popovers
import { IonContent, IonPopover } from '@ionic/vue';
import { popoverController } from '@ionic/vue';
import Popover from '@/components/popovers/PopOver.vue'; // test
import ImportPopover from '@/components/popovers/ImportPopover.vue';
import InputselPopover from '@/components/popovers/InputselPopover.vue';
import NodesPopover from "@/components/popovers/NodesPopover.vue"
import CtxPopover from "@/components/popovers/CtxPopover.vue"

// config popups
import CfgValuePop from "@/components/popovers/CfgValuePopover.vue"
import CfgValueParms from "@/components/popovers/CfgValuePopover.vue"
import CfgSelectPop from "@/components/popovers/CfgSelectPopover.vue"
import CfgSelectParms from "@/components/popovers/CfgSelectPopover.vue"

// story pop
import StoryPop from "@/components/popovers/StoryPopover.vue"

// --------------------
import NodeSel from '@/components/popovers/NodeSel.vue';
import nodeTypes from "@/assets/nodes/nodeTypes.json"
import { nodeFactory } from "@/services/NodeFactory"
import { NodeTypes } from '@/services/GlobalDefs';

import { IonButtons, IonToolbar } from '@ionic/vue';

// --------------------
// page change on ios modfiy layout. maybe due to animation
// try to restore when entering workspace
import { useRoute } from 'vue-router';
const route = useRoute()

watch(
  () => route.name,
  (name) => {
    console.log(`route is now : ${name}`)
    if (name == "Workspace") {
      ww.value = window.innerWidth
      wh.value = window.innerHeight
      console.log("ww,wh", ww.value, wh.value)
      // set variable so we can toggle toolbar etc
      smallScreen.value = (ww.value <= 996) ? true : false
      console.log("Small:",smallScreen.value)
      if (!flowWrap.value.style) flowWrap.value.style = {}
      flowWrap.value.style.width = "100%" //String(ww.value) + "px"
      flowWrap.value.style.height = String(wh.value * .7) + "px"
    }
  }
)

// -------------------------------


const props = defineProps<{ msg: string }>()

const emit = defineEmits(["addViz", "delViz","pdf"])

const count = ref(0)
const theFlow = ref(null)
const cy = ref()

const ww = ref(800)
const wh = ref(400)
const flowWrap = ref()
const flowLoaded = ref(false)

const ctl = ref()
const fileInput = ref(null)
const scrotDown = ref(null)
const scrotData = ref(null)

const popover = ref({})
const inputselPop = ref({})

// next node/edge continuosly increase
const nextNode = ref(1)

const nodeList = ref([])

const nextInsertedX = ref(0)

const smallScreen = ref(false)


const elements: ElementDefinition[] = [ // list of graph elements to start with
  /* 
  { // node a
    group: 'nodes', 
    //data: { id: 'a', name:"a", type:{"name":"t1","shp":"square","bd":"#f00", "img":"url('/img/icons-bordered/cloud-arrow-down.png')"} },  
    data: { id: 'a', name:"a", "ports":{"A":false}, type:{"name":"t1","shp":"square","bd":"#f00", "img":"url('/img/widgets/CSVFile.png')"} },  
    position: {x:10, y:10},
  },
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
      'shape': 'rectangle',
      'width': '30px',
      'height': '30px',
      'border-width': '2px',
      /*'border-color': '#000'*/
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
      "shape": "data(type.shp)",
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
      "font-size": "10px",
      "text-rotation": "autorotate",
      "text-margin-x": "0px",
      "text-margin-y": "0px"
    }
  },
  {
    //selector: 'edge[type].dark',
    selector: 'edge[dark]',
    style: {
      "color": "#f88",
      "background-color": "#000",
    }
  },
  // edge extension
  {
    selector: '.eh-preview',
    style: {
      "opacity": 1,
      'background-color': 'red',
      'line-color': 'red',
      'target-arrow-color': 'blue',
      'source-arrow-color': 'red'
    }
  },
  {
    selector: '.eh-ghost-edge',
    style: {
      "opacity": 0,
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

//const ctxMenu = ref()

const ctxOptions = {
  // Customize event to bring up the context menu
  // Possible options https://js.cytoscape.org/#events/user-input-device-events
  evtType: 'cxttap',
  // List of initial menu items
  // A menu item must have either onClickFunction or submenu or both
  menuItems: [
    {
      id: 'edge1',
      content: 'Connect',
      tooltipText: 'Start connection',
      selector: 'node',
      onClickFunction: async (event: EventObject) => {
        const { target } = event;
        //console.log("Start edge on:",target, target._private.data.id)
        cy.value.edgehandles('enable').disableDrawMode();
        const nd = await cy.value.getElementById(target.data("id"))
        nd.data("edge", "e1") // set a source type
        //console.log("Node:",nd)
        cy.value.edgehandles().start(nd)
      },
      disabled: false
    },
    /*
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
    */
    {
      id: 'e-remove',
      content: 'Remove',
      tooltipText: 'Remove selected edges',
      selector: 'edge',
      onClickFunction: async (event: EventObject) => {
        const { target } = event;
        console.log("Remove edge:", target)
        const src = target.data().source
        const dst = target.data().target
        console.log("S-T:", src, dst)
        cy.value.remove(target);
      },
      disabled: false
    },
    {
      id: 'n-remove',
      content: 'Remove',
      tooltipText: 'Remove selected nodes',
      selector: 'node',
      onClickFunction: async (event: EventObject) => {
        const { target } = event;
        await removeNode(target)
        /*
        console.log("Remove node:",target)
        cy.value.remove(target);
        const instance = target.data("instance")
        if (instance.display) {
          emit("delViz",instance.id)
        }
        // remove from nodelist
        const idx = nodeList.value.findIndex(item => item.id == instance.id)
        if (idx == -1) {
          throw (new Error("Invalid instance"))
        } 
        if (nodeList.value[idx].type == NodeTypes.GEN) {
          // stop generators
          console.log("Stopping generator on ",nodeList.value[idx].id)
          await nodeList.value[idx].stop()
        }
        nodeList.value.splice(idx,1)
        */
      },
      disabled: false
    },
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
  edgeParams: function (sourceNode: NodeSingular, targetNode: NodeSingular) {
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
    console.log("Extra on :", target)
  },
  disabled: false
}

watch(
  flowLoaded, (a) => {
    console.log("loaded:", a)
    if (a) {
      console.log("Next")
      /* 
       await nextTick() // not enough
      flowInit()
      */
      setTimeout(flowInit, 100)
    }
  }
)


//onMounted(async () => {
async function flowInit() {
  console.log("CTR:", theFlow.value)
  cy.value = await cytoscape({
    container: theFlow.value,
    layout: layout,
    style: style,
    elements: elements,
    // initial viewport state:
    zoom: 1,
    minZoom: 1,
    maxZoom: 10,
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
    eh.value = await cy.value.edgehandles(edgeOptions)
    // context menu
    //ctxMenu.value = await cy.value.contextMenus(ctxOptions)
    // append. works ... usable via show/hide 
    // await ctxMenu.value.appendMenuItem(extraItem)
    // 
    const j = await cy.value.json()
    console.log("JSON:", j)

    // add callbacks
    // NB: adding edges will cause temporary edge and node-add/remove event in addition to
    // the final add  
    cy.value.on('select', 'node', function (event: EventObject) {
      const node = event.target;
      console.log('Node ' + node.id() + ' was selected');
    });

    cy.value.on('unselect', 'node', function (event: EventObject) {
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
      let port = { data: Object.keys(t.data("ports"))[0] }
      let block = false
      const tp = t.data("ports")
      //
      const portsAvail = Object.keys(tp).filter(key => !tp[key])
      console.log("Available ports:", portsAvail)
      if (portsAvail == 0) {
        console.log("No free ports")
        block = true
      } else {
        // check popover
        if (Object.keys(tp).length > 1) {
          port = await openInputSel(tp)
          console.log("Port:", port)
          if (port.role != "button") {
            // FIXME throws error on removing edge
            // doint later with block seems to be fine
            console.log("Selection cancelled")
            block = true
            //await addedEdge.remove()
          }
        }
        // add edge name
        console.log("from ", s.data("name"), " to ", t.data("name"), ", port: ", port.data)
        await e.data("type", s.data("edge") + "-" + port.data)
        await s.removeData("edge")
        // we have a new connection from s to t. set up messaging
        const targetIdx = nodeList.value.findIndex(item => item.id == t.id())
        if (targetIdx == -1) throw (new Error("Invalid instance"))
        const targetInstance = nodeList.value[targetIdx]
        const signal = Signals.UPDPREFIX + s.id()
        await targetInstance.msgOn(Signals.UPDPREFIX + s.id(),port.data)
        // check if data avail for source if root
        if (providers.exists(s.id()) && providers.isLoadedRoot(s.id())) {
          //console.log("Send signal ", Signals.UPDPREFIX + s.id())
          await eventBus.emit(Signals.UPDPREFIX + s.id())
        }
        //
        /*
        const sourceIdx = nodeList.value.findIndex(item => item.id == s.id()) 
        // FIXME: start generators. maybe later via config
        if (nodeList.value[sourceIdx].type == NodeTypes.GEN) {
          await nodeList.value[sourceIdx].run()
        }
        */
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
        await e.data("port", port.data)
      } else {
        console.log("Removing edge", e.id())
        if (e.id() !== undefined) {
          try {
            console.log("NOW")
            await e.remove()
            //await addedEdge.remove()
            console.log("removed ...")
          } catch (err) {
            console.log("remove failed:", err.message)
          }
        }
      }
    });

    // disable edges from endpoints (chart, table, output)
    /*
    cy.value.on('cxttap', 'node', function(event?: EventObject) {
      const node = event.target;
      console.log('Node ' + node.id() + ' was right clicked');
      const idx = nodeList.value.findIndex(e => e.id == node.id())
      if (idx == -1) throw (new Error("Invalid node"))
      switch (nodeList.value[idx].type) {
        case NodeTypes.CHART:
        case NodeTypes.TABLE:
        case NodeTypes.OUTPUT:
          ctxMenu.value.hideMenuItem("edge1")
          break
        default:
          ctxMenu.value.showMenuItem("edge1")
      }
    });
    */

    // dbltab copy of dblclick
    // try taphold instead of dbltap. latter not working on ios?
    // taphold alos not working
    cy.value.on('taphold', "node", async function (event: EventObject) {
      const pos = event.position || event.cyPosition;
      console.log('Node dbltap or dblclick at ', pos, event.target.data("id"), event);
      const id = event.target.data("id")
      const idx = nodeList.value.findIndex(e => e.id == id)
      if (idx == -1) throw (new Error("Invalid id"))
      const instance = nodeList.value[idx]
      const options = ["config", "remove"]
      switch (instance.type) {
        case NodeTypes.CHART:
        case NodeTypes.TABLE:
        case NodeTypes.OUTPUT:
          break
        default:
          options.push("connect")
      }
      const nodeAction = await openCtxPopover(options.sort())
      if (nodeAction.role != "button") return
      const nd = await cy.value.getElementById(id)
      const { target } = event
      // or event.target
      console.log("Action:", nodeAction)
      switch (nodeAction.data) {
        case "config":
          console.log("Config")
          await configNode(instance)
          break;
        case "connect":
          console.log("Connect")
          await nd.data("edge", "e1") // set a source type
          //console.log("Node:",nd)
          await cy.value.edgehandles().start(nd)
          break;
        case "remove":
          console.log("Remove")
          await removeNode(target)
          break;
        default:
          throw (new Error("Invalid CTX action: " + nodeAction.data))
      }

    });

    cy.value.on('taphold', "edge", async function (event: EventObject) {
      console.log('Edge taphold ', event.target.data("id"), event);
      const id = event.target.data("id")
      const options = ["remove"]
      const action = await openCtxPopover(options.sort())
      if (action.role != "button") return
      console.log("Action:", action)
      const { target } = event
      const src = target.data().source
      const dst = target.data().target
      switch (action.data) {
        case "remove":
          console.log("Remove edge")

          console.log("Remove edge:", target)
          console.log("S-T:", src, dst)
          cy.value.remove(target);

          break;
        default:
          throw (new Error("Invalid CTX action: " + action.data))
      }
    });

    cy.value.on('dblclick', "edge", async function (event: EventObject) {
      const pos = event.position || event.cyPosition;
      console.log('Edge dblclick at ', pos, event);
    });
    /* */
    // remove handlers. remove edge will be triggered on delete node with edges
    cy.value.on("remove", "node", function (event: EventObject) {
      console.log("Remove node event:", event.target.data())
    })
    cy.value.on("remove", "edge", async function (event: EventObject) {
      console.log("Remove edge event:", event.target.data())
      // get port + target parameters from edge:
      const dt = event.target.data()
      console.log("DT:", dt)
      const port = dt.port
      const dst = dt.target
      const src = dt.source
      console.log("Port,target:", port, dst)
      if ((dst == undefined) || (port === undefined)) return
      // get target node
      const destNode = cy.value.getElementById(dst)
      if ((destNode == undefined) || (destNode.data() === undefined)) return
      console.log("tnode:", destNode, destNode.data(), destNode.data().ports[port])
      // remove port assignment
      destNode.data().ports[port] = false
      console.log("tnode port new:", destNode.data().ports[port])
      // also remove messaging 
      console.log("Removing listener at:", dst)
      const dstIdx = nodeList.value.findIndex(item => item.id == dst)
      if (dstIdx == -1) {
        throw (new Error("Dst invalid"))
      }
      const signal = Signals.UPDPREFIX + src
      console.log("Singal off:", signal)
      await nodeList.value[dstIdx].msgOff(signal)

    })
  }
}

/*
  const mdText = computed(() => {
    let t = marked.parse(props.src)
    if (props.zoom)
        t = t.replace("<img ","<img class=\"mdimage zoomable\" ")
    return t
})

*/
import * as DOMPurify from 'dompurify'
import  html2canvas from 'html2canvas'
import { jsPDF } from "jspdf";

import router from "@/router"
import { PrintStore } from "@/services/PrintStore"
const printStore = PrintStore()

const makePdf = async () => {
  console.log("Make PDF")
  alert("Preparing PDF. Click OK then wait a moment ...")
  // pdf init
  // Default export is a4 paper, portrait, using millimeters for units
  const options = {
    format: "a4",
    orientation: "portrait",
    unit: "mm"
  }
  const doc = new jsPDF(options);
  // Set the font and font size
  /*
  base 14 fonts:
    Courier
    Courier-Bold
    Courier-BoldOblique
    Courier-Oblique
    Helvetica
    Helvetica-Bold
    Helvetica-BoldOblique
    Helvetica-Oblique
    Times-Roman
    Times-Bold
    Times-Italic
    Times-BoldItalic
    Symbol
    ZapfDingbats
  */
  doc.setFont("Helvetica");
  doc.setFontSize(12);

  const imgWidth = 160

  // get story
  const story = userStore.getStory()

  // we actually start with markdown
  let md = "# Daten.Cafe\n"
  md += "<img class='doclogo' src='/img/logo/datencafe.png'/>\n\n"
  md += "## Story\n"
  md += "kmkfweklf \n kkwdkwnqd \n"
  md += "## Workflow\n\n"

  doc.text("Daten.Cafe", 10, 10);
  const  img = new Image()
  img.src = "/img/logo/datencafe.png"
  await doc.addImage(img, "PNG", 50,20, imgWidth/2, imgWidth/2)

  if (story.title > "") {
    doc.text("Title: " + story.title, 10, 150);
    doc.text("Author: " + story.author, 10, 160);
    doc.text("Date: " + story.date, 10, 170);
    doc.text("Link: " + story.link, 10, 180);

    // Define the text block and split it into lines using splitTextToSize method
    const text = story.text
    const lines = doc.splitTextToSize(text, imgWidth);

    // Add the lines to the PDF document
    doc.text(10, 200, lines);
    /*
    story.text.split("\n").forEach((l,i) => {
      doc.text(l, 10, 200 + i*10);
    })
    */
  } else {
    doc.text("Story", 10, 150);
    doc.text("Bla ...", 10, 160);
    doc.text("... bla", 10, 170);

  }
  await doc.addPage(options)

  // get flow image
  // extent:  { x1, y1, x2, y2, w, h }.
  await cy.value.fit()
  const flowWidth = await cy.value.extent().w
  const flowHeight = await cy.value.extent().h
  const flowAspect = flowWidth / flowHeight
  console.log("Flow aspect:",flowWidth, flowHeight, flowAspect)
  const wf = await cy.value.png({
    output: "base64uri",
    bg: "#ffffff",
    full:false,
    scale:1,
    maxWidth: 1280
  })


  doc.text("Flow", 10, 10);
  await doc.addImage(wf, "PNG", 10,20, imgWidth, Math.round(flowHeight/flowAspect))

  md += "<img class='docimg' src='" + wf + "'>\n\n"
  md += "kmkfweklf \n kkwdkwnqd \n"
  md += "## Output\n\n"
  md += "kmkfweklf \n kkwdkwnqd \n"

  console.log("Nodes:",nodeList.value.length)
  // get display nodes
  const displayNodes = nodeList.value.filter(i => i.display)
  for (const instance of displayNodes) {
  //nodeList.value.forEach(async (instance) => {
    //console.log(instance)
      const divName = instance.id.toUpperCase()
      const elem = await document.getElementById("DFPLOT-" + divName)
      // seems to work but is too slow ...
      const viz = await html2canvas(elem) //, options)
      const width = viz.width
      const height = viz.height
      const aspect = width/height
      const h = Math.round(imgWidth/aspect)
      console.log("w,h,a:",width,height,h,aspect)
      const dataURL = await viz.toDataURL();

      md += "### " + divName + "\n\n"
      md += "<img class='docimg' src='" + dataURL + "'>\n\n"
      md += "kmkfweklf \n kkwdkwnqd \n\n"

      await doc.addPage(options)
      doc.text(divName, 10, 10);
      await doc.addImage(dataURL, "PNG", 10,30, imgWidth,h)
      
  }
  //console.log(md)

  const html = await marked.parse(md)
  //console.log(html)
  const htmlClean = await DOMPurify.sanitize(html);
  //console.log(htmlClean)

  /*
  // insert html 
  await printStore.set(htmlClean)
  // push to print page
  router.push({
    name: 'PrintPage'
  })
  */

  doc.save("a4.pdf");


}

// story popover
const openStoryPop = async () => {
  console.log("Open Pop")
  popover.value = await popoverController.create({
      component: StoryPop,
      //event: ev,
      size: "cover",
      side:"left",
      cssClass:"storyPop",
      alignment:"start",
      showBackdrop: true,
      backdropDismiss: true, 
      dismissOnSelect: false,
      reference: "trigger", // event or trigger
      componentProps: { // Popover props
          signal: "popUp",
        }
    })
    await popover.value.present();
    popover.value.open = true
    const x = await popover.value.onDidDismiss();
    console.log("Dismiss: ",x)
    popover.value.open = false
}


onMounted(() => {
  ww.value = window.innerWidth
  wh.value = window.innerHeight
  console.log("ww,wh", ww.value, wh.value)
  // set variable so we can toggle toolbar etc
  smallScreen.value = (ww.value <= 996) ? true : false
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
  /*
  eventBus.on('popUp', (data) => {
    console.log("on PopUp:",data)
    // test if we can do something else while popover is active ..
    // allow to close on specific return value. only if open
    if (popover.value.open) {
      popover.value.dismiss(data,"button")
    }
  });
  */
  eventBus.on('popUp', (data) => defaultPopupHandler(data));

  /*
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
  eventBus.on('ctxSelection', (data) => {
    console.log("on ctxSelection:",data)
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
  */
})

/*
const ctlClick = async () => {
  console.log("clk")
  const j = await cy.value.json()
  console.log("JSON:",JSON.stringify(j))
  createEvent()
}
*/

const openCfgValuePopover = async (options: any) => {
  popover.value = await popoverController.create({
    component: CfgValuePop,
    size: "auto",
    side: "right",
    alignment: "start",
    showBackdrop: true,
    backdropDismiss: true,
    dismissOnSelect: false,
    reference: "trigger", // event or trigger
    componentProps: { // Popover props
      signal: "popUp",
      options: options
    }
  })
  // set popup handler
  eventBus.off("popUp")
  eventBus.on("popUp", (data) => {
    console.log("Pop default signal:", data)
    switch (data.id) {
      case "close":
        popover.value.dismiss(data, "button")
        break
      case "cancel":
        popover.value.dismiss(data, "backdrop")
        break
      default:
        console.log("Handle data here:", data)
    }
  })
  await popover.value.present();
  popover.value.open = true
  const x = await popover.value.onDidDismiss();
  console.log("Dismiss: ", x)
  popover.value.open = false
  eventBus.off("popUp")
  // restore default handler
  eventBus.on('popUp', (data) => defaultPopupHandler(data));
  return x
}

const openCfgSelectPopover = async (options: any) => {
  popover.value = await popoverController.create({
    component: CfgSelectPop,
    size: "auto",
    side: "right",
    alignment: "start",
    showBackdrop: true,
    backdropDismiss: true,
    dismissOnSelect: false,
    reference: "trigger", // event or trigger
    componentProps: { // Popover props
      signal: "popUp",
      options: options
    }
  })
  // set popup handler
  eventBus.off("popUp")
  eventBus.on("popUp", (data) => {
    console.log("Pop default signal:", data)
    switch (data.id) {
      case "close":
        popover.value.dismiss(data, "button")
        break
      case "cancel":
        popover.value.dismiss(data, "backdrop")
        break
      default:
        console.log("Handle data here:", data)
    }
  })
  await popover.value.present();
  popover.value.open = true
  const x = await popover.value.onDidDismiss();
  console.log("Dismiss: ", x)
  popover.value.open = false
  eventBus.off("popUp")
  // restore default handler
  eventBus.on('popUp', (data) => defaultPopupHandler(data));
  return x
}



const openCtxPopover = async (options: any) => {
  popover.value = await popoverController.create({
    component: CtxPopover,
    //event: ev,
    cssClass: " popCtx",
    size: "auto",
    side: "left",
    alignment: "start",
    showBackdrop: true,
    backdropDismiss: true,
    dismissOnSelect: false,
    reference: "trigger", // event or trigger
    componentProps: { // Popover props
      signal: "popUp",
      options: options
    }
  })
  await popover.value.present();
  popover.value.open = true
  const x = await popover.value.onDidDismiss();
  console.log("Dismiss: ", x)
  popover.value.open = false
  return x
}


//const openInputSel = async (ev: Event) => {
const openInputSel = async (ports) => {
  popover.value = await popoverController.create({
    component: InputselPopover,
    //event: ev,
    size: "auto",
    side: "right",
    alignment: "start",
    showBackdrop: true,
    backdropDismiss: true, // error when enabling dismiss
    dismissOnSelect: true,
    reference: "trigger", // event or trigger
    componentProps: { // Popover props
      msg: "Select Input",
      signal: "popUp",
      ports: ports
    }
  })
  await popover.value.present();
  popover.value.open = true
  const x = await popover.value.onDidDismiss();
  console.log("Dismiss: ", x)
  popover.value.open = false
  return x
}

const openNodeSel = async () => {
  popover.value = await popoverController.create({
    component: NodesPopover,
    //event: ev,
    size: "auto",
    side: "right",
    alignment: "start",
    showBackdrop: true,
    backdropDismiss: true,
    dismissOnSelect: false,
    reference: "trigger", // event or trigger
    componentProps: { // Popover props
      msg: "Select Input",
      signal: "popUp"
    }
  })
  popover.value.open = true
  await popover.value.present();
  const x = await popover.value.onDidDismiss();
  console.log(x)
  console.log("Dismiss: ", x)
  popover.value.open = false
  if (x.role == "button") {
    const nt = x.data
    console.log("Type from popup:", nt)
    // find node
    return nt
  } else {
    return ""
  }
}

const openPopover = async (ev: Event) => {
  // create dummy dataframe for test
  const df = await new DataFrame({
    "x1": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    "y1": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    "z1": ["asa", "dw", "ddddW", "y", "", "asa", "dw", "ddddW", "y", "", "asa", "dw", "ddddW", "y", ""],
    "x2": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    "y2": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    "z2": ["asa", "dw", "ddddW", "y", "", "asa", "dw", "ddddW", "y", "", "asa", "dw", "ddddW", "y", ""]
  }
  )
  /* ************************************* */
  // test json to/ftom
  const dfj = await toJSON(df)
  console.log("JSON:", dfj)
  const df2 = await new DataFrame(dfj)
  df2.print(5)
  /* ************************************* */

  /* */
  popover.value = await popoverController.create({
    component: ImportPopover,
    event: ev,
    size: "auto",
    side: "right",
    alignment: "start",
    showBackdrop: false,
    backdropDismiss: false,
    dismissOnSelect: false,
    reference: "trigger", // event or trigger
    componentProps: { // Popover props
      msg: "Select Option",
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

}

/*
 cy.zoom()        

Get or set the zoom level of the graph.
cy.zoom()

Get the zoom level.

cy.zoom( level )

Set the zoom level.

    level

    The zoom level to set.

cy.zoom( options )

Set the zoom level.

    options

    The options for zooming.
        level

        The zoom level to set.
        position

        The position about which to zoom.
        renderedPosition

        The rendered position about which to zoom.

Details

The zoom level must be a positive number. Zoom levels that are not numbers are ignored; zoom levels that are numbers but outside of the range of valid zoom levels are considered to be the closest, valid zoom level.

When zooming about a point via cy.zoom( options ), the options are defined as follows.

For zooming about a rendered position (i.e. a position on-screen):

cy.zoom({
  level: 2.0, // the zoom level
  renderedPosition: { x: 100, y: 100 }
});

--------

 cy.pan()      

Get or set the panning position of the graph.
cy.pan()

Get the current panning position.

cy.pan( renderedPosition )

Set the current panning position.

    renderedPosition

    The rendered position to pan the graph to.

Details

This function pans the graph viewport origin to the specified rendered pixel position.
Examples

Pan the graph to (100, 100) rendered pixels.

cy.pan({
  x: 100,
  y: 100 
});

console.log( cy.pan() ); // prints { x: 100, y: 100 }
-----------------
cy.panBy()    

Relatively pan the graph by a specified rendered position vector.
cy.panBy( renderedPosition )

    renderedPosition

    The rendered position vector to pan the graph by.

Details

This function shifts the viewport relatively by the specified position in rendered pixels. That is, specifying a shift of 100 to the right means a translation of 100 on-screen pixels to the right.
Examples

Pan the graph 100 pixels to the right.


cy.panBy({
  x: 100,
  y: 0 
});

----------

cy.width()  

Get the on-screen width of the viewport in pixels.
cy.height()  

Get the on-screen height of the viewport in pixels.
cy.extent()  

Get the extent of the viewport, a bounding box in model co-ordinates that lets you know what model positions are visible in the viewport.
Details

This function returns a plain object bounding box with format { x1, y1, x2, y2, w, h }.

*/

// pan dims are 2000x1000. also size at zoom=1
// larger zoom size becomes smaller

function panLeft() {
  if (cy.value.pan().x > 100) {
    cy.value.panBy({ x: -100, y: 0 })
  }
  console.log("Extent:", cy.value.extent())
  return cy.value.pan()
}
function panRight() {
  if (cy.value.pan().x < 2000) {
    cy.value.panBy({ x: 100, y: 0 })
  }
  console.log("Extent:", cy.value.extent())
  return cy.value.pan()
}
function panDown() {
  if (cy.value.pan().y < 1000) {
    cy.value.panBy({ x: 0, y: 100 })
  }
  console.log("Extent:", cy.value.extent())
  return cy.value.pan()
}
function panUp() {
  if (cy.value.pan().y > 100) {
    cy.value.panBy({ x: 0, y: -100 })
  }
  console.log("Extent:", cy.value.extent())
  return cy.value.pan()
}

function zoomIn() {
  // get panning position first
  const p = cy.value.pan()
  const z = cy.value.zoom()
  if (z < 10)
    cy.value.zoom(Math.floor(z + 1))
  else
    cy.value.zoom(10)
  console.log("Extent:", cy.value.extent())
  return cy.value.zoom()
}
function zoomOut() {
  const z = cy.value.zoom()
  if (z > 1)
    cy.value.zoom(Math.floor(z - 1))
  else
    cy.value.zoom(1)
  console.log("Extent:", cy.value.extent())
  return cy.value.zoom()
}
function zoomFit() {
  cy.value.fit()
  console.log("Extent:", cy.value.extent())
  return cy.value.zoom()
}
function extent() {
  const x = cy.value.extent()
  console.log("Extent:", x)
  return x
}

async function removeNode(target) {
  console.log("Remove node:", target)
  cy.value.remove(target);
  const instance = target.data("instance")
  if (instance.display) {
    emit("delViz", instance.id)
  }
  // remove from nodelist
  const idx = nodeList.value.findIndex(item => item.id == instance.id)
  if (idx == -1) {
    throw (new Error("Invalid instance"))
  }
  if (nodeList.value[idx].type == NodeTypes.GEN) {
    // stop generators
    console.log("Stopping generator on ", nodeList.value[idx].id)
    await nodeList.value[idx].stop()
  }
  nodeList.value.splice(idx, 1)
}

async function configNode(instance) {
  console.log("Node config:", instance.id)
  console.log("Config:", instance.config)
  if (instance.config.pop === undefined) {
    console.log("No config")
    return
  }
  let config = {}
  switch (instance.config.pop) {
    case "value":
      config = await openCfgValuePopover(instance.config.options)
      if (config.role == "button") {
        config = JSON.parse(config.data.value)
        console.log("Updating instance with ", config)
        instance.configure(config) // value array
      }
      break
    case "select":
      config = await openCfgSelectPopover(instance.config.options)
      if (config.role == "button") {
        config = config.data.value
        console.log("Updating instance with ", config)
        instance.configure(config) // value array
      }
      break
    default:
      throw (new Error("Invalid config pop"))
  }
  //const url = "https://raw.githubusercontent.com/digital-codes/datencafe/main/public/data/d3-date-sample.csv"    
  //const url = "https://transparenz.karlsruhe.de/dataset/cc50eb96-6c3d-4d6f-9dcd-c56c4969ff59/resource/565c1c6e-a50c-46d2-8638-22896d21096f/download/altersstruktur-der-bevolkerung-unter-3-jahrige-nach-geschlecht.csv"
  //await instance.load(url)
}

async function newNode() {
  console.log("Add node")
  const nodeType = await openNodeSel()
  console.log("NodeType from add node", nodeType)
  if (nodeType != "") {
    console.log("Type selected:", nodeType)
    console.log("Type:", nodeTypes[nodeType])
    // properties
    const nodeIcon = nodeTypes[nodeType].thumb
    const newId = "N" + String(nextNode.value++)
    const data = {
      //group: 'nodes',
      id: newId,
    };
    // add node
    // first get pan dimentsions
    const pan = cy.value.pan()
    const xtent = cy.value.extent()
    console.log("Pan:", pan, xtent)
    // set x position to middle // left[], y to center
    const xpos = xtent.x1 + xtent.w / 2 + nextInsertedX.value++ * 5
    const ypos = xtent.y1 + xtent.h / 2 + nextInsertedX.value++ * 5
    const newNode = await cy.value.add({
      data: data,
      position: {
        x: xpos,
        y: ypos
      }
    })
    // create class instance
    try {
      const instance = await nodeFactory(newId, nodeTypes[nodeType])
      /*
      console.log("Instance:",instance,instance.class)
      console.log(nodeTypes["lineplot"])
      console.log(nodeTypes[instance.class])
      console.log("Class description:",nodeTypes[instance.class])
      */
      // get ports and edges from instance
      const ports = {}
      instance.ports.forEach(p => {
        ports[p] = false
      });
      console.log("Ports:", ports)
      // we don't use edges yet ...
      const edges = {}
      instance.edges.forEach(e => {
        edges[e] = false
      });
      console.log("Edges:", edges)
      // determine style (shape,color) from type
      // good shapes: ellipse, rectange, roundrectangle, diamond
      let shape, border
      switch (instance.type) {
        case NodeTypes.CHART:
        case NodeTypes.TABLE:
          shape = "rectangle"
          border = "#0f0"
          break
        case NodeTypes.PROC:
          shape = "roundrectangle"
          border = "#000"
          break
        case NodeTypes.INPUT:
        case NodeTypes.GEN:
          shape = "round-octagon"
          border = "#00f"
          break
        default:
          shape = "ellipse"
          border = "#f00"
      }
      // set data
      const nodeData = {
        "name": newId,
        "ports": ports,
        "instance": {
          "id": instance.id,
          "name": instance.name,
          "type": instance.type,
          "display": instance.display | false
        },
        "type": {
          "name": nodeType,
          "shp": shape,
          "bd": border,
          "img": "url('" + nodeIcon + "')"
        }
      }
      newNode.data(nodeData)
      console.log("New node:", newNode.data())
      //console.log("After add node:",JSON.stringify(cy.value.json()))
      // check if we need to create a new diagram element 
      if (instance.display) {
        emit("addViz", nodeData.instance)
      } else {
        console.log("No display on ", nodeData.instance)
      }
      // add to list 
      nodeList.value.push(instance)
    } catch (err) {
      alert("Invalid instance:" + err.message)
      return
    }
  } else {
    console.log("Cancelled. Removing:")
  }
}

function defaultPopupHandler(data) {
  console.log("on PopUp:", data)
  // test if we can do something else while popover is active ..
  // allow to close on specific return value. only if open
  if (popover.value.open) {
    popover.value.dismiss(data, "button")
  }
}


function loadFlow() {
  console.log("Load flow")
  fileInput.value.click()
}


async function handleFileUpload(event) {
  const files = event.target.files
  console.log("Files loaded:", files.length)
  console.log(files[0])
  // Do something with the uploaded files
  const reader = new FileReader();
  reader.onload = async () => {
    const text = reader.result;
    //const df = new DataFrame(text, { delimiter: delimiter.value });
    //dataframe.value = df;
    const design = JSON.parse(text)
    console.log("design loaded:", design)
    await initFlow(design)
  };
  await reader.readAsText(files[0]);
}

async function initFlow(design: any) {
  // FIXME version missing
  const fields = Object.keys(design)
  console.log("Fields:", fields)
  if (!fields.includes("version")) throw (new Error("Version missing"))
  if (design.version != Version) {
    alert("Version mismatch: loaded " + design.version +" - current " + Version)
    throw (new Error("Version mismatch"))
  }
  if (!fields.includes("flow")) throw (new Error("Flow missing"))
  if (!fields.includes("nodes")) throw (new Error("Nodes missing"))
  if (!fields.includes("data")) throw (new Error("Data missing"))
  if (!fields.includes("next")) throw (new Error("Next missing"))
  if (!fields.includes("story")) throw (new Error("Story missing"))
  // set next id
  nextNode.value = design.next
  // set story
  await userStore.setTitle(design.story.title)
  await userStore.setAuthor(design.story.author)
  await userStore.setDate(design.story.date)
  await userStore.setEmail(design.story.email)
  await userStore.setLink(design.story.link)
  await userStore.setCategory(design.story.category)
  await userStore.setTags(design.story.tags)
  await userStore.setText(design.story.text)
  // set flow
  try {
    await cy.value.json(design.flow)
    console.log("Setting flow OK")
    await cy.value.fit()
  } catch (e) {
    console.log("Setting flow failed:", e.message)
    return
  }
  try {
    await providers.init(design.data)
    console.log("Setting data OK")
  } catch (e) {
    console.log("Setting data failed:", e.message)
    return
  }
  try {
    design.nodes.forEach(async (n) => {
      console.log("Node:", n.id, n.classname)
      // create the class instance
      try {
        const instance = await nodeFactory(n.id, nodeTypes[n.classname])
        if (instance.display) {
          await emit("addViz", { id: instance.id, name: instance.name, type: instance.type })
        }
        // configure
        console.log("Config:", n.config)
        instance.config = n.config
        // FIXME check running state on generator
        if (instance.type == NodeTypes.GEN) {
          const runIdx = instance.config.options.findIndex((item: any) => { return item.id == "run" })
          if (runIdx == -1) throw (new Error("Invalid config at run"))
          if (parseInt(instance.config.options[runIdx].value) != 0) {
            console.log("Starting generator on ", instance.id)
            instance.run()
          }
        }
        // signalling
        console.log("Signals:", n.sigs)
        n.sigs.forEach(async (s) => {
          console.log("Signal on for ", s)
          await instance.msgOn(s.signal,s.port)
        })
        // add to list 
        nodeList.value.push(instance)
      } catch (e) {
        console.log("Instance constructor failed:", e.message, n.id, n.classname)
        return
      }
    })
  } catch (e) {
    console.log("Setting nodes failed:", e.message)
    return
  }
  // finally trigger updates on root nodes
  // FIXME we should wait until all nodes are processed ... might need a watch item
  await DelayTimer(1000)
  const roots = providers.getLoadedRoots()
  //console.log("Roots:",roots)
  roots.forEach(async (n) => {
    //console.log("Root id:",n.id)
    const signal = Signals.UPDPREFIX + n.id
    await eventBus.emit(signal)
    await DelayTimer(50)
  })


}

/*
const loadFile = () => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const df = new DataFrame(text, { delimiter: delimiter.value });
      dataframe.value = df;
    };
    reader.readAsText(file.value);
  };
*/

async function clearFlow() {
  console.log("Clear flow")
  await cy.value.remove("*")
  //await cy.value.remove("edges")
  //await cy.value.remove("nodes")
  await cy.value.removeData()
  // clear storage
  providers.clear()
  // remove node messaging
  console.log("also remove charts")
  nodeList.value.forEach(n => {
    // remove listeners
    n.signals.forEach(s => n.msgOff(s.signal))
    // remove charts
    if (n.display) {
      emit("delViz", n.id)
    }
    if (n.type == NodeTypes.GEN) {
      const runIdx = n.config.options.findIndex((item: any) => { return item.id == "run" })
      if (runIdx == -1) throw (new Error("Invalid config at run"))
      if (parseInt(n.config.options[runIdx].value) != 0) {
        console.log("Stopping generator on ", n.id)
        n.stop()
      }
    }

  })
  // remove all nodes
  nodeList.value = []
  // clear story
  await userStore.clearStory()
  console.log(userStore.getStory())
}


async function screenShot() {
  console.log("Screenshot")
  scrotData.value = await cy.value.png({
    output: "base64uri",
    bg: "#ffffff",
    maxWidth: 1920
  })
  await DelayTimer(100)
  await scrotDown.value.click()
}

// this way the computation is repeated always.
// compute only after button click
const downUrl = computed(() => {
  console.log("Save flow")
  if (nodeList.value.length == 0) {
    return "/#"
  }

  const flow = cy.value.json()
  //console.log("Flow",flow)
  const nodes = []
  nodeList.value.forEach(n => nodes.push(n.json()))
  //console.log("Nodes",nodes)
  const data = providers.json()
  //console.log("Data:",data)
  // https://stackoverflow.com/questions/72997146/how-to-push-data-to-local-json-file-on-button-click-using-javascript
  try {
    const contentType = 'application/json'
    const story = userStore.getStory()
    console.log("Story:", story)
    const flowData = JSON.stringify({ version:Version,flow: flow, nodes: nodes, data: data, next: nextNode.value, story: story }, null, 2)
    const blob = new Blob([flowData], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    console.log("downurl updated")
    return url
  } catch (e) {
    console.log("Failed: ", e.message)
    return "/"
  }
})

/*
async function saveFlow() {
  console.log("Save flow")
  const flow = cy.value.json()
  console.log("Flow",flow)
  const nodes = []
  nodeList.value.forEach(n => nodes.push(n.json()))
  console.log("Nodes",nodes)
  const data = providers.json()
  console.log("Data:",data)
  // https://stackoverflow.com/questions/72997146/how-to-push-data-to-local-json-file-on-button-click-using-javascript
  try {
    const contentType = 'application/json'
    const flowData = JSON.stringify({flow:flow,nodes:nodes,data:data},null,2)
    const blob = new Blob([flowData], { type: contentType })
    const downUrl = window.URL.createObjectURL(blob)
    console.log("downurl",downUrl)
    return downUrl
  } catch (e) {
    console.log("Failed: ",e)
    return "/"
  }


}
*/

// tooltips
const tooltipsOpen = ref(false)
const closeTooltips = () => { tooltipsOpen.value = false }
const openTooltips = () => { tooltipsOpen.value = true }
const toggleTooltips = () => {
  tooltipsOpen.value = !tooltipsOpen.value
  console.log("Toggle:", tooltipsOpen)
}


</script>

<template>
  <div ref="pdfWrap" v-if="pdfWindow">
    <div v-html="pdfContent">
    </div>
  </div>
  <div ref="flowWrap" class="wrap">
    <input ref="fileInput" type="file" style="display:none" @change="handleFileUpload" />
    <a ref="scrotDown" style="display:none" :href="scrotData" download="flow.png"></a>
    <ion-toolbar v-if="!smallScreen" class="toolbar">
      <ion-buttons id="helpRef" class="ion-hide-sm-down question" slot="start">
        <ion-button @click="toggleTooltips">
          <font-awesome-icon :icon="['fas', 'question']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <!-- 
        <ion-buttons class="ion-hide-sm-down"  slot="start">
          <ion-button @click="zoomIn">
          <font-awesome-icon :icon="['fas', 'magnifying-glass-plus']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
        </ion-buttons>
        <ion-buttons class="ion-hide-sm-down"  slot="start" >
          <ion-button @click="zoomOut">
          <font-awesome-icon :icon="['fas', 'magnifying-glass-minus']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
        </ion-buttons>
        <ion-buttons class="ion-hide-sm-down" slot="start">
          <ion-button @click="panLeft">
          <font-awesome-icon :icon="['fas', 'arrow-left']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
        </ion-buttons>
        <ion-buttons class="ion-hide-sm-down"  slot="start">
          <ion-button @click="panRight">
          <font-awesome-icon :icon="['fas', 'arrow-right']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
        </ion-buttons>
        <ion-buttons class="ion-hide-sm-down"  slot="start">
          <ion-button @click="panUp">
          <font-awesome-icon :icon="['fas', 'arrow-up']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
        </ion-buttons>
        <ion-buttons class="ion-hide-sm-down"  slot="start">
          <ion-button @click="panDown">
          <font-awesome-icon :icon="['fas', 'arrow-down']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
        </ion-buttons>

        -->
      <ion-buttons slot="start">
        <ion-button id="fitRef" @click="zoomFit">
          <font-awesome-icon :icon="['fas', 'expand']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="start">
        <ion-button id="storyRef" @click="openStoryPop">
          <font-awesome-icon :icon="['fas', 'pen-to-square']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="start">
        <ion-button id="pdfRef" @click="makePdf">
          <font-awesome-icon :icon="['fas', 'file-pdf']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="start">
        <ion-button id="captureRef" :disabled="nodeList.length == 0" @click="screenShot">
          <font-awesome-icon :icon="['fas', 'image']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button id="trashRef" :disabled="nodeList.length == 0" @click="clearFlow">
          <font-awesome-icon :icon="['fas', 'trash-can']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button id="downRef" :disabled="nodeList.length == 0" download="flow.json" :href="downUrl">
          <font-awesome-icon :icon="['fas', 'download']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button id="upRef" :disabled="nodeList.length > 0" @click="loadFlow">
          <font-awesome-icon :icon="['fas', 'upload']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button id="newRef" @click="newNode">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" size="2x" class="toolbtn"></font-awesome-icon>
        </ion-button>
        <!-- 
          <NodeSel msg="Select Input" signal="nodeSelection" />
          -->
      </ion-buttons>
    </ion-toolbar>
    <ion-toolbar v-if="smallScreen" class="toolbar-sm">
      <ion-buttons slot="start" class="question">
        <ion-button id="helpRef" @click="toggleTooltips">
          <font-awesome-icon :icon="['fas', 'question']" size="sm" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>

      <ion-buttons slot="start">
        <ion-button id="fitRef" @click="zoomFit">
          <font-awesome-icon :icon="['fas', 'expand']" size="sm" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>

      <ion-buttons slot="start">
        <ion-button id="storyRef" @click="openStoryPop">
          <font-awesome-icon :icon="['fas', 'pen-to-square']" size="sm" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>

      <ion-buttons slot="start">
        <ion-button id="pdfRef" @click="makePdf">
          <font-awesome-icon :icon="['fas', 'file-pdf']" size="sm" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>

      <ion-buttons slot="start">
        <ion-button id="captureRef" :disabled="nodeList.length == 0" @click="screenShot">
          <font-awesome-icon :icon="['fas', 'image']" size="sm" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button id="trashRef" :disabled="nodeList.length == 0" @click="clearFlow">
          <font-awesome-icon :icon="['fas', 'trash-can']" size="sm" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button id="downRef" :disabled="nodeList.length == 0" download="flow.json" :href="downUrl">
          <font-awesome-icon :icon="['fas', 'download']" size="sm" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button id="upRef" :disabled="nodeList.length = 0" @click="loadFlow">
          <font-awesome-icon :icon="['fas', 'upload']" size="sm" class="toolbtn"></font-awesome-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button id="newRef" @click="newNode">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" size="sm" class="toolbtn"></font-awesome-icon>
        </ion-button>
        <!-- 
          <NodeSel msg="Select Input" signal="nodeSelection" />
          -->
      </ion-buttons>
    </ion-toolbar>

    <!-- 
      <div ref="ctl" class="ctl">
        <ion-button @click='ctlClick'>Clk</ion-button>
        <ion-button @click="openPopover">Click Me</ion-button>
      </div>
      -->
      <!-- this is where the flow will be installed -->
    <div class="flow" ref="theFlow"></div>
  </div>

  <!-- tooltips -->
  <!-- 
        <ion-popover trigger="helpRef" trigger-action="hover" show-backdrop="false" size="auto" side="bottom" alignment="start">
                <ion-content class="ion-padding">{{ $t("flow.tooltip.help") }}</ion-content>
        </ion-popover>

        -->

  <ion-popover cssClass="my-custom-popover-class pop1 popLeft" :isOpen="tooltipsOpen" trigger="fitRef"
    trigger-action="context-menu" show-backdrop="false" size="auto" side="bottom" alignment="start">
    <ion-content class="ion-padding">{{ $t("flow.tooltip.fit") }}</ion-content>
  </ion-popover>
  <ion-popover cssClass="my-custom-popover-class pop2 popLeft" :isOpen="tooltipsOpen" trigger="storyRef"
    trigger-action="context-menu" show-backdrop="false" size="auto" side="bottom" alignment="start">
    <ion-content class="ion-padding">{{ $t("flow.tooltip.story") }}</ion-content>
  </ion-popover>
  <ion-popover cssClass="my-custom-popover-class pop3 popLeft" :isOpen="tooltipsOpen" trigger="pdfRef"
    trigger-action="context-menu" show-backdrop="false" size="auto" side="bottom" alignment="start">
    <ion-content class="ion-padding">{{ $t("flow.tooltip.pdf") }}</ion-content>
  </ion-popover>
  <ion-popover cssClass="my-custom-popover-class pop4 popLeft" :isOpen="tooltipsOpen" trigger="captureRef"
    trigger-action="context-menu" show-backdrop="false" size="auto" side="bottom" alignment="start">
    <ion-content class="ion-padding">{{ $t("flow.tooltip.capture") }}</ion-content>
  </ion-popover>
  <ion-popover cssClass="my-custom-popover-class pop1" :isOpen="tooltipsOpen" trigger="trashRef"
    trigger-action="context-menu" show-backdrop="false" size="auto" side="bottom" alignment="start">
    <ion-content class="ion-padding">{{ $t("flow.tooltip.trash") }}</ion-content>
  </ion-popover>
  <ion-popover cssClass="my-custom-popover-class pop2" :isOpen="tooltipsOpen" trigger="downRef"
    trigger-action="context-menu" show-backdrop="false" size="auto" side="bottom" alignment="start">
    <ion-content class="ion-padding">{{ $t("flow.tooltip.down") }}</ion-content>
  </ion-popover>
  <ion-popover cssClass="my-custom-popover-class pop3" :isOpen="tooltipsOpen" trigger="upRef"
    trigger-action="context-menu" show-backdrop="false" size="auto" side="bottom" alignment="start">
    <ion-content class="ion-padding">{{ $t("flow.tooltip.up") }}</ion-content>
  </ion-popover>
  <ion-popover cssClass="my-custom-popover-class pop4" :isOpen="tooltipsOpen" @didDismiss="closeTooltips" trigger="newRef"
    trigger-action="context-menu" show-backdrop="false" size="auto" side="bottom" alignment="start">
    <ion-content class="ion-padding">{{ $t("flow.tooltip.new") }}</ion-content>
  </ion-popover>
</template>


<style scoped>
/* tooltip styling via custom class */
.my-custom-popover-class {
  --offset-y: 1px;
  --offset-x: -10px;
}

.my-custom-popover-class.pop1 {
  --offset-y: 10px;
}

.my-custom-popover-class.pop2 {
  --offset-y: 80px;
}

.my-custom-popover-class.pop3 {
  --offset-y: 150px;
}

.my-custom-popover-class.pop4 {
  --offset-y: 220px;
}

.popLeft {
  --offset-x: -50px;
}

.my-custom-popover-class ion-content {
  --background: --var(--ion-color-light);
  --border-radius: 8px;
  line-height: 1rem;
  overflow: clip;
}

.wrap {
  position: relative;
  /* dark mode not working yet, set light BG */
  background-color: --var(--ion-color-light);
}

.toolbar {
  background: var(--ion-color-light);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  max-width: 34rem;
  border: 3px solid var(--ion-color-dark-shade);
}

.toolbar-sm {
  background: var(--ion-color-light);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  max-width: 20rem;
  border: 3px solid var(--ion-color-dark-shade);
}

.question {
  margin-right: 1rem;
}

.ctl {
  position: absolute;
  top: 0;
  left: 500px;
  z-index: 10;
  width: 50px;
  height: 50px;
  background: #cc0;
  display: flex;
  align-items: center;
  justify-content: center;


}

.flow {
  background:#fff;
  width: 100%;
  min-width: 300px;
  height: 100%;
  min-height: 300px;
  display: block;
}

.node {
  color: #f00;
}

.edge {
  color: #00f;
}

.t1 {
  display: none;
}
</style>

<style>
/* global styling */



.t1 {
  display: none;
}

.flow canvas {
  left: 0;
}

.ctx-menu {
  background-color: #422;
  padding: 3px;
}

.ctx-item {
  background-color: #f0f;
  padding: 3px;
  margin: 3px;
}
</style>

<style>
/*
  .doclogo {
    text-align:center;
    width:50%;
    margin-left:auto;
    margin-right:auto;
  }
  .docimg {
    width:90%;
    margin-left:auto;
    margin-right:auto;
  }
  @media print {
    .docimg {
      page-break-after:always;
    } 
  }
*/
</style>

