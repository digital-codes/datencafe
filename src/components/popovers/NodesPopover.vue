<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ props.msg }}</p>
    <NodeSel :signal="signal" />
</ion-content>
</template>

<script lang="ts" setup>
import { IonContent } from '@ionic/vue';
import { ref, onMounted } from "vue"

import NodeSel  from '@/components/popovers/NodeSel.vue';

const props = defineProps({
  msg:String,
  signal:String,
})


</script>


<style>

ion-buttons {
  /*
  overflow:scroll;
  */
}

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
  max-width: calc(100vw - 100px);
  --min-width: 280px;
  overflow: clip;
}
/* sm is 576, md is 768 */
@media only screen and (max-width: 768px) {
  ion-popover ion-content {
    max-height: calc(80vh - 1rem);
    max-width: calc(100vw - 1rem)!important;
  }
}




ion-content.ion-popover::part(scroll) {
  overflow:clip;
  }


.popcheck {
    text-align:center;
  }
  


</style>

