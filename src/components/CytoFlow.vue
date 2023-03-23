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

import * as dfd from 'danfojs/dist/danfojs-browser/src';


// popover
import { popoverController } from '@ionic/vue';
import Popover from './PopOver.vue'; // test
import ImportPopover from './ImportPopover.vue';
import eventBus from '../services/eventBus';

// ----------------------
import { userStore } from '../services/store'
const store = userStore()

import { providerStore } from '../services/srcStore'
import { Client, Provider } from '../services/srcStore'
const providers = providerStore()

import { subscriberStore } from '../services/dstStore'
import { Subscriber } from '../services/dstStore'
const subscribers = subscriberStore()

// test stores
for (let i=0;i<3;i++) {
  const p = "P" + String(i)
  providers.add(p)
}
for (let i=0;i<3;i++) {
  const p = "P" + String(i)
  providers.remove(p)
}
// test
try {
  providers.remove("XY")
} catch (e) {
  console.log("Faield:", e)
}
// ---
for (let i=0;i<3;i++) {
  const p = "S" + String(i)
  subscribers.add(p)
  console.log("exists:",subscribers.exists(p))
}
for (let i=0;i<3;i++) {
  const p = "S" + String(i)
  subscribers.remove(p)
}
// test
try {
  console.log("exists:",subscribers.exists("XY"))
  subscribers.remove("XY")
} catch (e) {
  console.log("Faield:", e)
}

// 
providers.add("P1",true)
providers.add("P2")
console.log("Roots:",providers.getLoadedRoots())
subscribers.add("S1")
subscribers.add("S2")
// connect
providers.connect("P1",{id:"S1",type:"T1"})
providers.connect("P1",{id:"S2",type:"T2"})
providers.connect("P2",{id:"S2",type:"T1"})
providers.connect("P1",{id:"S1",type:"T2"})

try {
  providers.connect("P3",{id:"S1",type:"T1"})
} catch (e) {
  console.log("Faield:", e)
}

// we cannot test this without a reference between the stores
// handle during connecting
/*
try {
  providers.connect("P1",{id:"S3",type:"T1"})
} catch (e) {
  console.log("Faield:", e)
}
*/

console.log("P",providers.json())
console.log("S",subscribers.json())

// update provider returns list of subscriber ids
let dsts = providers.update("P1",{x:123,y:"wdw"})
console.log("New data - dsts to update:",dsts)
console.log("Roots:",providers.getLoadedRoots())
console.log("P",providers.json())
console.log("S",subscribers.json())

// update without data
dsts = providers.update("P1")
console.log("dsts to update:",dsts)
try {
  dsts = providers.update("P2")
  console.log("Reuse data - dsts to update:",dsts)
} catch (e) {
  console.log("Failed:", e)
}

dsts.forEach((d) => {
  console.log("Updating:",d)
  subscribers.update(d)
})

console.log("S",subscribers.json())

const dt = ref([])
const testData = () => {
  const d = {"x":dt.value.length,"y":Math.random()*100 }
  dt.value.push(d)
  console.log("data",dt.value)
  setTimeout(testData,5000)
  const dsts = providers.update("P1",dfd.toJSON(new dfd.DataFrame(dt.value)))
  console.log("P1 dsts to update:",dsts)
  dsts.forEach(async (d) => {
    subscribers.update(d)
    await eventBus.emit("UPD-" + d)
  })

}

testData()



// --------------------



defineProps<{ msg: string }>()

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

// next node/edge continuosly increase
const nextNode = ref(1)
const nextEdge = ref(1)

const elements: ElementDefinition[] = [ // list of graph elements to start with
  { // node a
    group: 'nodes', 
    data: { id: 'a', name:"a", type:{"name":"t1","shp":"square","bd":"#f00", "img":"url('/img/icons-bordered/cloud-arrow-down.png')"} },  
    position: {x:10, y:10},
  },
  { // node b
    group: 'nodes', 
    data: { id: 'b', name:"b", type:{"name":"t3","shp":"roundrectangle","bd":"#f00", "img":"url('/img/icons-bordered/chart-line.png')"} }, 
    position: {x:250, y:100},
  },
  { // node c
    group: 'nodes', 
    data: { id: 'c', name:"c", type:{"name":"t2","shp":"roundrectangle","bd":"#0f0", "img":"url('/img/icons-bordered/database.png')"}  },
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
        "text-margin-y": "0px"    }
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
      coreAsWell: true,
      onClickFunction: async function (event: EventObject) {
        console.log("Add node")
        const pos = event.position || event.cyPosition;
        const newId = "N" + String(nextNode.value++)
        const data = {
          //group: 'nodes',
          id:newId,
        };
        const newNode = await cy.value.add({
          data: data,
          position: {
            x: pos.x + 20,
            y: pos.y + 5
          }
        })
        // set data
        const nodeData = {"name":"new","type":{"name":"t0",
          "shp":"circle","bd":"#f00", "img":"url('/img/icons-bordered/question.png')"}}
        newNode.data(nodeData)
        //console.log("After add node:",JSON.stringify(cy.value.json()))
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

    // When an edge is successfully created, log the event to the console
    cy.value.on('ehcomplete', async (event: EventObject, sourceNode: NodeSingular, targetNode: NodeSingular, addedEdge: EdgeSingular) => {
      console.log(`Edge created from ${sourceNode.id()} to ${targetNode.id()}`);
      // we have stored the edge type in the source node. copy to edge type
      const e = await cy.value.getElementById(addedEdge.data("id"))
      const s = await cy.value.getElementById(sourceNode.data("id"))
      const t = await cy.value.getElementById(targetNode.data("id"))
      console.log("from ",s.data("name"), " to ",t.data("name"))
      await e.data("type",s.data("edge"))
      await s.removeData("edge")
      // we can open a dialog here like so:
          // popBtn.value.$el.click()
          // with params edge.type, source.id, target.id
          // to configure the target node
          // and the store

      //console.log("Elems:",elements.length)
      //console.log("json len:",cy.value.json().elements.edges.length)
    });

    cy.value.on('cxttap', 'node', function(event: EventObject) {
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
    eventBus.on('importSelection', (data) => {
      console.log("on importSelection:",data)
      // test if we can do something else while popover is active ..
      const clrs = ["#f00","#f0f","#ff0","#00f"]
      ctl.value.style.background = clrs[Math.floor(Math.random()*clrs.length)];
      // works. background changes
      // allow to close on specific return value. only if open
      if (popover.value.open) {
        if (data.close == true)
          popover.value.dismiss(data,"123")
      }
    });
    testStore()
  })
  
const ctlClick = async () => {
  console.log("clk")
  const j = await cy.value.json()
  console.log("JSON:",JSON.stringify(j))
  createEvent()
}


const openPopover = async (ev: Event) => {
  // create dummy dataframe for test
  const df = await new dfd.DataFrame({
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
    const dfj = await dfd.toJSON(df)
    console.log("JSON:",dfj)
    const df2 = await new dfd.DataFrame(dfj)
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

const createEvent = () => {
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
  // or we just use the default from the popover button with reference = trigger
  console.log("btn",popBtn.value)
  popBtn.value.$el.click()
}

const testStore = async () => {

  const newUser = {
    id: '1234',
      name: 'John Doe',
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345'
      },
      phone: '555-555-1212'
  }
  await store.addUser(newUser)
  const u = await store.getUserById(newUser.id)
  console.log("User:",u)

}

</script>

<template>

  <div ref="flowWrap" class="wrap">
    <div ref="ctl" class="ctl">
      <ion-button @click='ctlClick'>Clk</ion-button>
      <ion-button ref="popBtn" @click="openPopover">Click Me</ion-button>
    </div>
    <div class="flow" ref="theFlow"></div>
  </div>

</template>

<style scoped>
.wrap {
  position:relative;
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
