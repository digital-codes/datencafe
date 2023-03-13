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

import type { ElementDefinition, Stylesheet } from 'cytoscape';
import type { Core, EventObject } from 'cytoscape';
import type { NodeSingular, EdgeSingular } from 'cytoscape';

import type { MenuOptions } from 'cytoscape-context-menus';

// register extensions
cytoscape.use(contextMenus);
cytoscape.use( edgehandles );


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


const elements: ElementDefinition[] = [ // list of graph elements to start with
  { // node a
    group: 'nodes', 
    data: { id: 'a', type:{"name":"t1","shp":"square","bd":"#f00", "img":"url('/assets/icon/icon.png')"} },  
    position: {x:10, y:10},
  },
  { // node b
    group: 'nodes', 
    data: { id: 'b' }, 
    position: {x:250, y:100},
  },
  { // node c
    group: 'nodes', 
    data: { id: 'c', type:{"name":"t2","shp":"roundrectangle","bd":"#0f0", "img":"url('/assets/icon/icon.png')"}  },
    position: {x:130, y:150},
  },
  { // edge ab
    group: 'edges', 
    data: { id: 'ab', source: 'a', target: 'b' }
  },
  { // edge ac
    group: 'edges', 
    data: { id: 'ac', source: 'a', target: 'c', name: "src1-ac" }
  },
  { // edge bc
    group: 'edges', 
    data: { id: 'bc', source: 'b', target: 'c', name: "src2-bc" }
  }
]

// see https://stackoverflow.com/questions/58136352/cytoscape-js-position-label-text-on-top-of-edge

const style: Stylesheet[] = [ // the stylesheet for the graph
{
    selector: 'node',
    style: {
      'label': 'data(id)',
      "text-valign": "center",
      "text-halign": "center",    
        'background-fit': 'cover',
        'background-color': '#fff',
        'shape': 'circle',
        'width': '30px',
        'height': '30px',
        'border-width': '2px',
        'border-color': '#000'
      }    
  },
  {
    selector: 'node[type]',
    style: {
      "shape":"data(type.shp)",
      'border-color': 'data(type.bd)',
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
    // special selector if object has data attribute "name"
    selector: 'edge[name]',
    style: {
      'label': 'data(name)',
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
      onClickFunction: (event: EventObject) => {
        const { target } = event;
        //console.log("Start edge on:",target, target._private.data.id)
        cy.value.edgehandles('enable').disableDrawMode();
        const nd = cy.value.getElementById(target.data("id"))
        nd.data("srcType","scr1") // set a source type
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
      onClickFunction: (event: EventObject) => {
        const { target } = event;
        //console.log("Start edge on:",target, target._private.data.id)
        cy.value.edgehandles('enable').disableDrawMode();
        const nd = cy.value.getElementById(target.data("id"))
        nd.data("srcType","scr2") // set a source type
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
      onClickFunction: function (event: EventObject) {
        console.log("Add node")
        const pos = event.position || event.cyPosition;
        const data = {
          group: 'nodes'
        };
        cy.value.add({
          data: data,
          position: {
            x: pos.x,
            y: pos.y
          }
        });
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
      }
    )
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
      const e = await cy.value.getElementById(addedEdge.data("id"))
      const s = await cy.value.getElementById(sourceNode.data("id"))
      e.data("name",s.data("srcType") + "-123")
      await s.removeData( "srcType" )
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
      popBtn.value.click()
    });

        

    }
  }



  onMounted(() =>  {
    ww.value = window.innerWidth
    wh.value = window.innerHeight
    console.log("ww,wh",ww.value,wh.value)
    if (!flowWrap.value.style) flowWrap.value.style = {}
    flowWrap.value.style.width = String(ww.value) + "px"
    flowWrap.value.style.height = String(wh.value * .6) + "px"
    flowLoaded.value = true
  })
  
const ctlClick = () => {
  console.log("clk")
  createEvent()
}


import { popoverController } from '@ionic/vue';
import Popover from './PopOver.vue';

const roleMsg = ref("")

const openPopover = async (ev: Event) => {
    const popover = await popoverController.create({
      component: Popover,
      event: ev,
      size: "auto",
      side:"right",
      alignment:"start",
      showBackdrop: false,
      backdropDismiss: true,
      dismissOnSelect: true,
      reference: "trigger" // event or trigger
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    roleMsg.value = `Popover dismissed with role: ${role}`;
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
  popBtn.value.click()
}


</script>

<template>

  <div ref="flowWrap" class="wrap">
    <div ref="ctl" class="ctl">
      <ion-button @click='ctlClick'>Clk</ion-button>
      <ion-button ref="popBtn" @click="openPopover">Click Me</ion-button>
      <p>{{ roleMsg }}</p>
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
  min-width: 400px;
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
