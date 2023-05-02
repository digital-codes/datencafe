<template>
  <ion-content class="ion-padding ion-popover storyPop">
    <p>Sketch</p>
    <div>
      <canvas ref="cv"  @mousedown="startDrawing" @mousemove="drawShape" @mouseup="stopDrawing"></canvas>      
    </div>
    <div>
      <img ref="img" :src="imgSrc"/>
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

// -----------------
const cv = ref()
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
  context.lineWidth = 4;

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

const saveImage = () => {
  const canvas = cv.value
  const image = canvas.toDataURL();
  imgSrc.value = image
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

