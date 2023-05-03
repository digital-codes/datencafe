<template>
  <ion-content class="ion-padding ion-popover storyPop">
    <p>WebCam</p>
    <div style="padding:10px;" >
      <video ref="cv"></video>      
    </div>
    <div>
      <canvas ref="ocv"></canvas>      
    </div>
    <ion-button @click="start">Start</ion-button>
    <ion-button @click="capture">Capture</ion-button>
    <ion-button @click="stop">Stop</ion-button>
    <ion-button @click="save">Save</ion-button>
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
const cam = ref()
//const img = ref()

const props = defineProps({
  signal:String
})

const start = async () => {
  cam.value = await tf.data.webcam(cv.value);
};

const stop = async () => {
  await cam.value.stop()
};

const capture = async () => {
  console.log("capture")
  const img = await cam.value.capture();

  console.log(img.shape)
  
  const outputSize = [128,128];

  // Resample the tensor to the desired output size
  // NB: size is height first!
  const resampled = await tf.image.resizeBilinear(img, [outputSize[1],outputSize[0]],true);
  // Normalize the tensor
  const normalized = await resampled.div(tf.scalar(255));
 
  // Convert the tensor to a 2D array and create an image data object
  const data = await tf.browser.toPixels(normalized);
  const imageData = new ImageData(data, outputSize[0], outputSize[1]);

  // Display the image data
  const ocanvas = ocv.value
  ocanvas.width = outputSize[0];
  ocanvas.height = outputSize[1];
  const octx = ocanvas.getContext('2d');
  await octx.putImageData(imageData, 0, 0);

  await img.dispose()
  
};


const save = async () => {
  console.log("save")
  const canvas = ocv.value
  const image = canvas.toDataURL();
  const src = await image
  console.log(src)
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
div {
  display:block;
  text-align:center;
}
canvas {
  border: 2px solid var(--ion-color-primary);
}
img {
  border: 2px solid var(--ion-color-secondary);
}

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
  --height: calc(80vh - 20px);
  /*
  width: calc(100vw - 20px);
  --width: calc(100vw - 20px);
  */
  width:fit-content;
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

