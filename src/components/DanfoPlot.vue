<template>
<div ref="plotWrap" class="container" >
  <div v-if="items.length==0" >
    <p>{{$t("titles.work.view.placeholder")}}</p>

  </div>
  <div v-for="(item,index) in items" :key="index" class="chartItem">
    <h3 class="dftitle">{{ item.name }}</h3>
    <div :id="prefix + item.id" :class="item.type == 'table'?'dftable':'dfchart'">
    </div>
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

  // here, we just initialize items. With initial value, watcheffect 
  // will stilll be triggered ...
  items.value = [] //props.propItems
  console.log("DanfoPlot Mounted:",items.value)
  loaded.value = true
})

watchEffect(() => {
  if (props.propItems) {
    console.log("Danfo data update:", props.propItems)
    items.value = [] // props.propItems
    props.propItems.forEach(e => {
      e.key = 1 // init key
      items.value.push(e) // unshift(e)
      /*
      if (items.value.findIndex(i => e.id == i.id) == -1) {
        items.value.push(e) // unshift(e)
      }
      */
    });
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

