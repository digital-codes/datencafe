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
  max-width: calc(100vw - 200px);
  --min-width: 280px;
  overflow: clip;
}

ion-content.ion-popover::part(scroll) {
  overflow:clip;
  }


.popcheck {
    text-align:center;
  }
  
  .list {
  max-height: 200px;
  max-width: 400px;
  overflow-x:hide;
  overflow-y: scroll;
}

/* tooltip here ...
https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_tooltip
*/

.item {
  position: relative;
  overflow: hidden; 
}
.label {
  position: absolute;
  top:0;
  left: 0;
}
.tooltip {
  visibility:hidden;
  overflow: hidden; 
  color: #c00;
  height: 0;
  font-size: 80%;
}
.item:hover .tooltip {
  visibility:visible;
  position: absolute;
  left: 0;
  top: 0;
  background: #ddd;
  width:90%;
  height:100%;
  overflow-wrap: break-word;
  word-break:break-word;
  overflow: clip; 
}


</style>

