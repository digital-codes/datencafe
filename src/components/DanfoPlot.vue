<template>
<div ref="plotWrap" class="container" >
  <div v-for="(item,index) in items" :key="index" class="chartItem">
    <h3 class="dftitle">{{ item.name }}</h3>
    <!--
    <div :id="prefix + item.id" :class="item.type == 'table'?'dftable':'dfchart'" :key="item.key">
    -->
    <div :id="prefix + item.id" :class="item.type == 'table'?'dftable':'dfchart'">
    </div>
    <p>{{ item.key }}</p>
  </div>
</div>
</template>
  
<script setup>
import { ref, reactive, onMounted, watchEffect, computed } from "vue"
// globals
import { Signals } from "../services/GlobalDefs"
import eventBus from '../services/eventBus';

// items
const props = defineProps({
    propItems: {
      type: Object,
      required: true,
    },
  });

const loaded = ref(false)
const items = ref([])
const prefix = Signals.PLOTPREFIX

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
  plotWrap.value.style.height = String(wh.value * .7) + "px"

  items.value = props.propItems
  console.log("Mounted:",items.value)
  loaded.value = true
})

watchEffect(() => {
  if (props.propItems) {
    console.log("Danfo data update:", props.propItems)
    props.propItems.forEach(e => {
      e.key = 1 // init key
      if (items.value.findIndex(i => {e.id == i.id}) == -1) {
        console.log("Push item", e.id)
        items.value.unshift(e)
        // set messaging
        //const key = 
        const signal = Signals.PLOTPREFIX + e.id
        eventBus.on(signal, () => {
          console.log("Update signal:", signal)
        // test if we can do something else while popover is active ..
        // allow to close on specific return value. only if open
        console.log("FIXME: signal.off missing")
        const itemId = signal.split("-")[1]
        console.log("ItemId:", itemId)
        const idx = items.value.findIndex(ii => {
          console.log("Checking ", ii.id)
          return ii.id == itemId 
        })
        if (idx == -1) {
          throw (new Error("Invalid id:" + itemId))
        }
        // update key
        items.value[idx].key++
        console.log("Updated item key for: ",items.value[idx],items.value[idx].key)

        })
      }
    });
    items.value = props.propItems
  }
});


</script>
  
  <style scoped>

  .container {
    /*
    max-height: 600px;
    */
    overflow: scroll;
    padding-right: 20px;
  }

  .chartItem {
    overflow-x: scroll;
  }
  /* compute table width from number of columns in display class
  and set width via item prop. Scrolling-X handled via chartitem  */
  .dftable {
    background-color:#ccf;
    height:300px;
  }

  .dfchart {
    background-color:#cfc;
    height:300px;
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
    background-color: #f0f0f0;
    font-weight: bold;
  }
  
  select {
    margin-left: 10px;
  }
  </style>

