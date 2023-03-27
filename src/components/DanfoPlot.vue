<template>
<div class="container" v-if="loaded">
  <div v-for="(item,index) in items" :key="index">
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

onMounted(() => {
    items.value = props.propItems
    console.log("Mounted:",items.value)
    loaded.value = true
  })

watchEffect(() => {
  if (props.propItems) {
    console.log("data update:", props.propItems)
    items.value = props.propItems
  }
});

</script>
  
  <style scoped>

  .container {
    max-height: 600px;
    overflow: scroll;
    padding-right: 20px;
  }

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

