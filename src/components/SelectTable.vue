<template>
<div class="container">
    <table>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <td v-for="(cell, jndex) in row" :key="jndex" 
              :class="{ selected: isSelected(index, jndex) }"
              @click="selectCell(index, jndex)">
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
    <p>Selected:</p>
    <div ref="tbl"></div>
  </div>
  </template>
  
  <script setup>
  import { ref, watchEffect } from 'vue';
  import * as dfd from 'danfojs/dist/danfojs-browser/src';
  
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
  
  const rwidth = 3 // width of column row
  const columns = ref([]);
  const selected = ref([])
  const rows = ref([])
  const tbl = ref(null)


  watchEffect(() => {
    if (props.data) {
      console.log("table data:", props.data)
      columns.value = props.data.columns;
      rows.value = []
      let r = []
      columns.value.forEach((col,idx) => {
        console.log(col,idx)
        r.push(col)
        if (idx && (idx % (rwidth - 1) == 0)) {
          rows.value.push(r)
          console.log(r)
          r = []
        }
      });
      if (r.length) {
        rows.value.push(r)
      }
    }
  });

  function updatePreview() {
    const cols = []
    selected.value.forEach((item) => {
      cols.push(item.name)
    })
    const df = props.data.head(5).plot(tbl.value).table({
      config : {
        columns:cols
      }
    })
  }

  function selectCell(rowIndex, cellIndex) {
        const index = selected.value.findIndex(item => item.rowIndex === rowIndex && item.cellIndex === cellIndex);
        if (index !== -1) {
          selected.value.splice(index, 1);
        } else {
          selected.value.push({ rowIndex, cellIndex, name:columns.value[rowIndex*rwidth+cellIndex] });
        }
        updatePreview()
      }

  function isSelected(rowIndex, cellIndex) {
        return selected.value.some(item => item.rowIndex === rowIndex && item.cellIndex === cellIndex);
      }
  </script>
  
  <style scoped>

  .container {
    max-height: 400px;
    overflow: scroll;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }
  
  td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  }
  
  td:nth-child(even) {
    background-color: #f0f0f0;
  }
  td:nth-child(odd) {
    background-color: #c0c0c0;
  }
  
  select {
    margin-left: 10px;
  }

  td.selected {
    background-color: yellow;
    font-weight: bold;
  }

  </style>

