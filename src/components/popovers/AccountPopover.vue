<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ $t(props.message) }}</p>
</ion-content>
</template>

<script lang="ts" setup>
import { IonContent } from '@ionic/vue';


const props = defineProps({
  signal:String,
  message: String
})


</script>


<style>

ion-popover {
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

ion-popover ion-content {
  max-height: calc(80vh - 100px);
  max-width: calc(100vw - 200px);
  overflow: clip;
}

ion-content.ion-popover::part(scroll) {
  overflow:clip;
  }

  
  

</style>

