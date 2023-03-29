<template>
    <div>
      <input type="text" v-model="csvUrl">
      <button @click="loadCsv">Load CSV</button>
      <table v-if="data">
        <thead>
          <tr>
            <th v-for="(col,idx) in columns" :key="idx">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row,ridx) in data" :key="ridx">
            <td v-for="(col,cidx) in columns" :key="cidx">{{ row[cidx] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
    /*
        Here's a sample code that demonstrates how to load a CSV file from a user-defined URL,
         display the data in an HTML table, and perform basic data processing using Danfo.js:
        This code defines a Vue component that has an input field and a button to load a
        CSV file from a user-defined URL. When the button is clicked, the loadCsv function is called, 
        which fetches the CSV file, creates a Danfo.js DataFrame from the text, 
        extracts the data and column names, and updates the data and columns variables.

        The HTML table is displayed using Vue's template syntax, which loops over the data and column
         names to generate the table rows and headers. The table is only displayed if data is not null.

        To use this component, you can import it in your Vue app and add it to your template:

    */

  import { ref } from "vue"
  const csvUrl = ref("");
  const data = ref(null);
  const columns = ref([]);
  
  import * as dfd from "danfojs/dist/danfojs-base/"
  import * as io from "danfojs/dist/danfojs-base/io/browser"

  const emit = defineEmits(['newData']);


  const loadCsv = async () => {
    console.log("loading")
    if (csvUrl.value == ""){
      console.log("url empty")
      return
    }
    const csvOptions = {
    //delimiter: ",",
    delimitersToGuess: [',', ';'],
    escapeChar:"\\",
    quoteChar:"\"",
    header:true, // header row
    preview:0, // > 0 is how many lines previews
    skipEmptyLines:true
  }

    const df = await io.readCSVBrowser(csvUrl.value,csvOptions)
    console.log("Values:",df.values)
    console.log("Columns:",df.columns)
    data.value = df.values;
    columns.value = df.columns;
    console.log("opened:",df)
    emit('newData', df);

  };
  </script>

