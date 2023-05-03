<template>
  <ion-content class="ion-padding ion-popover storyPop">
    <p>Sketch</p>
    <div>
      <canvas ref="cv"  @mousedown="startDrawing" @mousemove="drawShape" @mouseup="stopDrawing"></canvas>      
    </div>
    <div>
      <img ref="img" :src="imgSrc"/>
      <canvas ref="ocv"></canvas>      
    </div>
    <ion-button @click="saveImage">Save</ion-button>
    <ion-button @click="clearDrawing">Clear</ion-button>
    <ion-button @click="close">{{$t("flow.cfg.close")}}</ion-button>

</ion-content>
</template>

<script lang="ts" setup>
/**
 * handles multiple options
 * returns single item on update  
 * teminates on close (no data)
 * 
 */ 
import { IonContent, IonButton } from '@ionic/vue';
import { IonLabel, IonItem, IonInput, IonTextarea } from '@ionic/vue';
import { IonList, IonSelect, IonSelectOption } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '@/services/eventBus';

import { UserStore, UserInfo } from '@/services/UserStore'
const userStore = UserStore();

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

import { DataFrame, toJSON } from "danfojs/dist/danfojs-browser/src";
import * as tf from "@tensorflow/tfjs";


// -----------------
const cv = ref()
const ocv = ref()
const img = ref()
const imgSrc = ref("")

const isDrawing = ref(false)
const currentX = ref(0)
const currentY = ref(0)

const props = defineProps({
  signal:String
})



const startDrawing = (event) => {
  isDrawing.value = true;
  currentX.value = event.offsetX;
  currentY.value = event.offsetY;
};

const drawShape = (event) => {
  if (!isDrawing.value) return;

  const canvas = event.target;
  const context = canvas.getContext('2d');

  context.strokeStyle = 'black';
  context.lineWidth = 6;

  context.beginPath();
  context.moveTo(currentX.value, currentY.value);
  context.lineTo(event.offsetX, event.offsetY);
  context.stroke();

  currentX.value = event.offsetX;
  currentY.value = event.offsetY;
};

const stopDrawing = () => {
  isDrawing.value = false;
};

const clearDrawing = () => {
  isDrawing.value = false;
  const canvas = cv.value
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height)
};

const saveImage = async () => {
  const canvas = cv.value
  const image = canvas.toDataURL();
  imgSrc.value = await image
  // tf convert
  const context = await canvas.getContext('2d');
  const imgData = await context.getImageData(0, 0, canvas.width, canvas.height);
  // Create a Tensor from the image data
  const tensor = await tf.browser.fromPixels(imgData,4); // include alpha with 4 channels
  // Print the shape of the Tensor
  console.log("input",tensor.shape);

  /*
  // Load an image from a URL
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "https://example.com/image.jpg";
  */

  // Define the desired output size
  const outputSize = [96,64];

  // Resample the tensor to the desired output size
  const resampled = await tf.image.resizeBilinear(tensor, outputSize,false);
  console.log("resampled",resampled.shape);
  // Normalize the tensor
  const normalized = await resampled.div(tf.scalar(255));

  /*
  // Reshape the tensor to a 4D tensor with a batch size of 1
  const reshaped = await normalized.expandDims();

  // Scale the tensor to the range [-1, 1]
  const scaled = await normalized.sub(tf.scalar(0.5)).mul(tf.scalar(1.99));
  */
  
  // Convert the tensor to a 2D array and create an image data object

  const data = await tf.browser.toPixels(normalized);
  const imageData = new ImageData(data, outputSize[0], outputSize[1]);

  // Display the image data
  const ocanvas = ocv.value
  ocanvas.width = outputSize[0];
  ocanvas.height = outputSize[1];
  const octx = ocanvas.getContext('2d');
  octx.putImageData(imageData, 0, 0);
 

  // Dispose of the tensors to free up memory
  tensor.dispose();
  resampled.dispose();
  /*
  normalized.dispose();
  reshaped.dispose();
  scaled.dispose();
  */
};


// -----------------



onMounted(() => {
  cv.value.width = 200;
  cv.value.height = 200;
  })

  const close = async () => {
  //console.log('close')
  await eventBus.emit(props.signal, {"id":"close"});
}

</script>


<style scoped>

ion-buttons {
  /*
  overflow:scroll;
  */
}

ion-popover.storyPop {
  margin:5px;
  --width: auto;
  --height: auto;
  /*
  --width: auto;
  --height: auto;
  --min-width: 200px;
  --min-height: 200px;
  --max-height: calc(100vh - 100px);
  --max-width: calc(100vw - 30px);
  */
}

ion-popover.storyPop ion-content {
  height: calc(80vh - 20px);
  width: calc(100vw - 20px);
  --height: calc(80vh - 20px);
  --width: calc(100vw - 20px);
  overflow: clip;
}

ion-content.ion-popover::part(scroll) {
  overflow:scroll;
  }

.storyPop {
  min-width:300px;
}

textarea {
  overflow: scroll;

}
.storyItem {
  max-height: 100px;
}
.story {
}

.list {
  width:48%;
}

</style>

