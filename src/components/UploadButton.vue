<template>
    <div>
      <input ref="fileInput" type="file" style="display: none" @change="handleFileUpload" />
      <button @click="startFileUpload">Upload File</button>
    </div>
  </template>
  
  <script>
  // chatgpt
  import { ref } from 'vue'
  
  export default {
    setup() {
      const fileInputRef = ref(null)
  
      function startFileUpload() {
        fileInputRef.value.click()
      }
  
      function handleFileUpload(event) {
        const files = event.target.files
        // Do something with the uploaded files
      }
  
      return {
        fileInputRef,
        startFileUpload,
        handleFileUpload,
      }
    },
  }
  </script>
  