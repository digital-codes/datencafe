<template>
<div ref="plotWrap" class="container" :class="locking?'wrapLocked':'wrapFree'">
  <div v-if="items.length==0" >
    <p>{{$t("titles.work.view.placeholder")}}</p>

  </div>
  <!-- 
  <div v-for="(item,index) in items" :key="index" class="chartItem">
  -->
  <div v-for="(item,idx) in items" :key="item.id" :id="itemPrefix + item.id"  class="chartItem" :class="locked[idx]?'focus':'free'" >
    <h3 class="dftitle">{{ item.name }}
    <ion-button v-if="!locked[idx]" class="lock" @click="lock(idx,1)" :disabled="item.type == NodeSpec.LEAFLET">
          <font-awesome-icon
            :icon="['fas', 'lock']"
            size="sm"
            class="toolbtn"
          ></font-awesome-icon>
        </ion-button>
        <ion-button v-if="locked[idx]" class="lock"  @click="lock(idx,0)">
          <font-awesome-icon
            :icon="['fas', 'lock-open']"
            size="sm"
            class="toolbtn"
          ></font-awesome-icon>
        </ion-button>
      </h3>
      <!-- 
      <div :id="prefix + item.id" :class="item.type == 'table'?'dftable':'dfchart' locked[idx]?'focus':'free'" >
      </div>
      -->
      <div :id="prefix + item.id" :class="chartClass(idx)" >
      </div>
  </div>
</div>
</template>
  
<script setup>
import { ref, reactive, onMounted, watchEffect, computed, nextTick } from "vue"
import { IonButton } from "@ionic/vue";
// globals
import { PreFixes } from "../services/GlobalDefs"
import { Signals } from "../services/GlobalDefs"
import eventBus from '../services/eventBus';

import { NodeSpec } from "@/services/GlobalDefs";

// items
const props = defineProps({
    propItems: {
      type: Object,
      required: true,
    },
  });

const loaded = ref(false)
const items = ref([])
const prefix = PreFixes.PLOTPREFIX
const itemPrefix = "CHARTITEM-"
const locked = ref([])

// same as for flowWrap ...
const ww = ref(800)
const wh = ref(400)
const plotWrap = ref()

onMounted(() => {
  // same as flowwrap
  ww.value = window.innerWidth
  wh.value = window.innerHeight
  if (!plotWrap.value.style) plotWrap.value.style = {}
  plotWrap.value.style.width = "100%" //String(ww.value) + "px"
  // we can do this in css with calc ...
  //plotWrap.value.style.height = String(wh.value * .6) + "px"

  // here, we just initialize items. With initial value, watcheffect 
  // will stilll be triggered ...
  items.value = [] //props.propItems
  locked.value = [] //props.propItems
  console.log("DanfoPlot Mounted:",items.value)
  loaded.value = true
})

const chartClass = (idx) => {
    if (!loaded.value || !items.value) {
      return {}
    }
    console.log("Index",idx,items.value)
    return {
      dftable: items.value[idx].type == NodeSpec.TABLE,
      dfchart: items.value[idx].type != NodeSpec.TABLE,
      chartFocus: locked.value[idx]
    }
  }

watchEffect(() => {
  if (loaded.value && props.propItems) {
    console.log("Danfo data update:", props.propItems)
    items.value = JSON.parse(JSON.stringify(props.propItems))
    locked.value = []
    props.propItems.forEach(() => locked.value.push(false))
    /*
    items.value = [] // props.propItems
    props.propItems.forEach(e => {
      e.key = 1 // init key
      items.value.unshift(e) // unshift(e)
    });
    */
  }
});

const locking = ref(false)

const lock = async (idx,state) => {
  console.log("lock:",idx,state)
  locked.value[idx] = state
  await nextTick()
  const item = document.getElementById(itemPrefix + items.value[idx].id)
  const offset = item.offsetTop
  console.log("Offset:",offset)
  /*
  if (!item.style) item.style = {}
  if (state) {
    item.style.transform = "translate(0px,-" + String(offset - 100) + "px)" 
  } else {
    item.style.transform = ""
  }
  */
  items.value.forEach((xi,xidx) => {
    const xitem = document.getElementById(itemPrefix + items.value[xidx].id)
    if (!xitem.style) xitem.style = {}
    if (state) {
      locking.value = true
      // lock one, hide others
      if (idx == xidx) {
        console.log("Locking item ",xitem.id)
        xitem.style.transform = "translate(0px,-" + String(offset - 60) + "px)" 
        xitem.style.visibility = "visible"
        plotWrap.value.style.overflow = "clip"
      } else {
        console.log("Hiding item ",xitem.id)
        xitem.style.transform = ""
        xitem.style.visibility = "hidden"
      }
    } else {
      // unhide all     
      locking.value = false
      console.log("Free item ",xitem.id)
      xitem.style.transform = ""
      xitem.style.visibility = "visible"
      plotWrap.value.style.overflow = "scroll"
    }
  })
}

/*
alternative
set container overflow to clip
transform translate item to top 
set visibility of others to hidden

const element = document.getElementById("myDIV");
let pos = element.offsetTop;


*/

</script>
  
  <style scoped>

ion-button.lock {
  vertical-align: middle;
}

.focus1 {
  position: fixed;
  top: 150px;
  z-index: 1000;
  background: #fff;
  height:calc(60vh);
}

.chartFocus {
  /*
  height:70%;
  */
}

.free {

}


  .container {
    /*
    max-height: 600px;
    */
    height: calc(70vh);
    padding-right: 20px;
    background:#fff;
  }

  .wrapLocked {
    overflow:clip;
  }

  .wrapFree {
    overflow:scroll;
  }


/* must fix h3 color */
h3 {
  color:#000;
  border: solid 1px #ccc;
  margin:5px;
}

  .chartItem {
    /*
    overflow-x: scroll;
    */
  }
  /* compute table width from number of columns in display class
  and set width via item prop. Scrolling-X handled via chartitem  */
  .dftable {
    color:#000;
    background-color:#ccf;
    height:350px;
    width: calc(38vw);
  }

  .dfchart {
    color:#000;
    background-color:#cfc;
    height:350px;
    width: calc(38vw);
  }

  .dfmap {
    color:#000;
    background-color:#cfc;
    height:350px;
    width: calc(38vw);
  }

  
  table {
    border-collapse: collapse;
    width: 100%;
  }
  
  th,
  td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  }
  
  th:first-child,
  td:first-child {
    color:#000;
    background-color: #f0f0f0;
    font-weight: bold;
  }
  
  select {
    margin-left: 10px;
  }

  @media only screen and (max-width: 996px) {
    .container {
      height: calc(60vh);
      padding-right: 10px;
    }

    .dftable {
    color:#000;
    background-color:#ccf;
    height:350px;
    width: calc(85vw);
  }

  .dfchart {
    color:#000;
    background-color:#cfc;
    height:350px;
    width: calc(85vw);
  }

  .dfmap {
    color:#000;
    background-color:#cfc;
    height:350px;
    width: calc(85vw);
  }

  }


  </style>

