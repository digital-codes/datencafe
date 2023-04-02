<template>
  <div class="file-upload-container" @drop.prevent="onDrop" @dragover.prevent>
    <label for="file-input" class="dropzone">
      <p>Drag and drop a CSV file here, or click to select a file.</p>
      <input type="file" ref="fileInput" id="file-input" accept=".csv" style="position: absolute; top: -9999px; left: -9999px;" @change="onFileInputChange" />
    </label>
    <!--
    <input type="file" ref="fileInput" @change="onFileInputChange" style="display: none" accept=".csv" />
    <div class="dropzone">
      <p>Drag and drop a CSV file here, or click to select a file.</p>
    </div>
    -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as io from "danfojs/dist/danfojs-base/io/browser"

const emit = defineEmits(['newData']);

const fileInput = ref(null);

const onFileInputChange = () => {
  const files = fileInput.value.files;
  if (files.length > 0) {
    readFile(files[0]);
  }
};

const onDrop = (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    readFile(files[0]);
  }
};

const readFile = (file) => {
  const reader = new FileReader();
  const csvOpts = {
    delimiter: ",",
    escapeChar:"\\",
    quoteChar:"\"",
    header:true, // header row
    preview:0, // > 0 is how many lines previews
    skipEmptyLines:true
  }
  reader.onload = async () => {
    const blob = await new Blob([reader.result], { type: 'text/csv' });
    console.log("rdr result:",blob)
    const df = await io.readCSVBrowser(blob,csvOpts)
    // Do something with the Danfo.js DataFrame here
    console.log("dropped:",df)
    emit('newData', df);
  };
  reader.readAsArrayBuffer(file);
};
</script>

<style scoped>

.file-upload-container {
  border: 2px solid #ff0;
  height: 4rem;
  width:80%;
  margin-left:auto;
  margin-right:auto;
  padding: 5px;
  display: block;
}
.dropzone {
  border: 2px solid #00f;
  display: inline-block;
}

</style>
