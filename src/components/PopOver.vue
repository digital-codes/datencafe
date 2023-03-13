<template>
  <ion-content class="ion-padding ion-popover">
    <p>Select Segment</p>
        <ion-segment value="default" v-model="seg1" @ionChange="newSeg1">
            <ion-segment-button value="default">
            <ion-label>Default</ion-label>
            </ion-segment-button>
            <ion-segment-button value="segment1">
            <ion-label>Segment1</ion-label>
            </ion-segment-button>
            <ion-segment-button value="segment2">
            <ion-label>Segment2</ion-label>
            </ion-segment-button>
            <ion-segment-button value="segment3">
            <ion-label>Segment3</ion-label>
            </ion-segment-button>
            <ion-segment-button value="segment4">
            <ion-label>Segment4</ion-label>
            </ion-segment-button>
            <ion-segment-button value="segment5">
            <ion-label>Segment5</ion-label>
            </ion-segment-button>
        </ion-segment>    
        <p>Select Segment</p>
        <ion-segment value="default">
            <ion-segment-button value="default">
            <ion-label>Default</ion-label>
            </ion-segment-button>
            <ion-segment-button value="segment1">
            <ion-label>Segment1</ion-label>
            </ion-segment-button>
            <ion-segment-button value="segment2">
            <ion-label>Segment2</ion-label>
            </ion-segment-button>
            <ion-segment-button value="segment3">
            <ion-label>Segment3</ion-label>
            </ion-segment-button>
        </ion-segment>    
        <p>Select Segment</p>
        <ion-segment value="default">
            <ion-segment-button value="default">
            <ion-label>Default</ion-label>
            </ion-segment-button>
            <ion-segment-button value="segment1">
            <ion-label>Segment1</ion-label>
            </ion-segment-button>
            <ion-segment-button value="segment2">
            <ion-label>Segment2</ion-label>
            </ion-segment-button>
            <ion-segment-button value="segment3">
            <ion-label>Segment3</ion-label>
            </ion-segment-button>
        </ion-segment>    
  </ion-content>
</template>

<script lang="ts" setup>
import { IonContent } from '@ionic/vue';
import { defineComponent } from 'vue';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/vue';

import { ref,defineEmits, defineProps } from "vue"

import eventBus from '../services/eventBus';
/*
type Events = {
  selected: string;
  close?: string;
};
*/
/*
const emitter = mitt<Events>(); // inferred as Emitter<Events>

emitter.on('foo', (e) => {}); // 'e' has inferred type 'string'

emitter.emit('foo', 42); // Error: Argument of type 'number' is not assignable to parameter of type 'string'. (2345)
*/


const emit = defineEmits(['sel']);

const seg1 = ref("default")

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
