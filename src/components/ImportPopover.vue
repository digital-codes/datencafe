<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ props.msg }}</p>
    <ion-segment :value="cols[0]" v-model="seg1" @ionChange="newSeg1">
        <ion-segment-button v-for="(item,idx) in cols" :key="idx" :value="item">
        <ion-label>{{ item }}</ion-label>
        </ion-segment-button>
    </ion-segment>    
  </ion-content>
</template>

<script lang="ts" setup>
import { IonContent } from '@ionic/vue';
import { defineComponent } from 'vue';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/vue';

import { ref, onMounted } from "vue"
import * as dfd from 'danfojs/dist/danfojs-browser/src';

import eventBus from '../services/eventBus';

const emit = defineEmits(['importSelection']);
const seg1 = ref("default")

const props = defineProps({
  msg:String,
  dt: {
    type: dfd.DataFrame, 
    required: true,
  },
})

const cols = ref([])

onMounted(() => {
  cols.value = props.dt.columns
  console.log("Cols:",cols.value)
})

const newSeg1 = async (e) => {
    console.log("seg1:",e.detail.value, seg1.value)
    emit("sel",seg1.value)
    await eventBus.emit('selected', seg1.value);

}

</script>


<style>
ion-popover {
  --width: auto;
  --height: auto;
  width: auto !important;
  height: auto !important;
  max-width: calc(100vw - 30px);
  max-height: calc(100vh - 30px);
}

ion-popover ion-content {
  --max-height: calc(100vh - 100px);
}
</style>
