<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ $t("flow.cfg.params") }}</p>
    <div>
      <ion-list>
        <ion-label>Category</ion-label>
    <ion-item>
      <ion-select placeholder="Select fruit" v-model="category">
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="oranges">Oranges</ion-select-option>
        <ion-select-option value="bananas">Bananas</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-list>
  <ion-list>
        <ion-label>Tags</ion-label>
    <ion-item>
      <ion-select multiple="true" placeholder="Select fruit" v-model="tags">
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="oranges">Oranges</ion-select-option>
        <ion-select-option value="bananas">Bananas</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-list>

      <ion-label>Story</ion-label>
      <ion-item class="storyItem">
      <ion-textarea class="story" v-model="story" 
        placeholder="Type something here" :auto-grow="true" maxlength=1000 wrap="soft" inputmode="text"
        value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tellus sem, auctor accumsan egestas sed, venenatis at ex. Nam consequat ex odio, suscipit rhoncus orci dictum eget. Aenean sit amet ligula varius felis facilisis lacinia nec volutpat nulla. Duis ullamcorper sit amet turpis sed blandit. Integer pretium massa eu faucibus interdum.">
      </ion-textarea>
  </ion-item>
    <ion-button @click="close">{{$t("flow.cfg.close")}}</ion-button>
    </div>
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
import { IonLabel, IonItem, IonTextarea } from '@ionic/vue';
import { IonList, IonSelect, IonSelectOption } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '@/services/eventBus';

export interface CfgValueParms {
    id: string // for translation 
    type: string // ui element type: url, text, number
    label: string // label
    value?: string | [] // default and return value 
    min?: string // 
    max?: string // 
}

const story = ref("")
const tags = ref([])
const category = ref("")

const props = defineProps({
  signal:String,
})

onMounted(() => {
  //props.options.forEach(e => vals.value.push(e.value))
})

const close = async () => {
  //console.log('close')
  const data = {"tags":tags.value,"category":category.value,"story":story.value}
  console.log(data)
  await eventBus.emit(props.signal, {"id":"close","value":JSON.stringify(data)} as CfgValueParms);
}

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
  overflow: clip;
}

ion-content.ion-popover::part(scroll) {
  overflow:clip;
  }

.storyItem {
  max-height: 150px;
  overflow: scroll;
}
.story {
}
 

</style>

