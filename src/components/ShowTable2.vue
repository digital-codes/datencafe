<template>
<div class="container">
    <table>
      <thead>
        <tr>
          <!-- with index the first col has no header -->
          <th></th>
          <th v-for="(col,idx) in columns" :key="idx">
            <div>
              <span>{{ col }}</span>
              <select v-model="dataTypes[col]" @change="changeDataType(col)">
                <option v-for="(option,oidx) in dataTypeOptions" :key="oidx" :value="option">{{ option }}</option>
              </select>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="index in indexData" :key="index">
          <th>{{ index }}</th>
          <td v-for="col in columns" :key="col">{{ localData.at(index, col) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watchEffect } from 'vue';
  
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
  
  const columns = ref([]);
  const indexData = ref([]);
  const dataTypes = ref({});
  const dataTypeOptions = ref(['int', 'float', 'string']);
  const localData = ref()

  onMounted(() => {
    localData.value = props.data
  })

  watchEffect(() => {
    if (props.data) {
      console.log("table data:", props.data)
      localData.value = props.data
      columns.value = localData.value.columns;
      indexData.value = localData.value.index;
  
      columns.value.forEach((col) => {
        dataTypes.value[col] = localData.value.dtypes[col];
      });
    }
  });
  
  function changeDataType(col) {
    const newType = dataTypes.value[col];
    localData.value = localData.value.astype({ [col]: newType });
  }
  /**
In this updated code, we define a dataTypes reactive variable using ref(), 
which is an object that maps column names to data types. We also define a 
dataTypeOptions variable that lists the data types that the user can select from.

In the template, we add an input field to each column header that displays 
the current data type and allows the user to select a new data type from the dataTypeOptions list.

We bind the v-model of each input field to the corresponding property in
 the dataTypes object, so that changes made by the user will update the dataTypes object.

We also add an @change event listener to each input field that calls a
 new changeDataType method whenever the user selects a new data type.

The changeDataType method updates the data type of the corresponding
 column using the astype method of the danfo.DataFrame object. 
 This method takes an object that maps column names to data types.

To use this updated component, you can pass a danfo.DataFrame object
 to the data prop, as before. The user can then select a new data type 
 for each column using the input fields in the table header. 
 When the user selects a new data type, the corresponding column
  will be updated in the danfo.DataFrame object and the table will be re-rendered.

  */
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

