<template>
  <ion-content class="ion-content ion-padding settingsPop">
    <p>{{ $t("flow.settings.header") }}</p>
    <div>
      <ion-text :color="conscolor">{{ $t("flow.settings.consent") }}</ion-text>
      <ion-item lines="none">
        <ion-label slot="start">{{ $t("no") }}  </ion-label>
        <ion-toggle slot="start" v-model="consent"></ion-toggle>
        <ion-label slot="start">{{ $t("yes") }} </ion-label>
        <ion-note>{{ $t("flow.settings.gdpr")}}</ion-note>
      </ion-item>      
      <ion-text color="primary">{{ $t("flow.settings.fullsize") }} </ion-text>
      <ion-item  lines="none">
        <ion-label slot="start">{{ $t("no") }}  </ion-label>
        <ion-toggle disabled slot="start" v-model="fullsize"></ion-toggle>
        <ion-label slot="start">{{ $t("yes") }} </ion-label>
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
import { IonLabel, IonItem, IonToggle, IonText, IonNote } from '@ionic/vue';

import { ref, onMounted, computed } from "vue"

import eventBus from '@/services/eventBus';

import { UserStore, UserInfo } from '@/services/UserStore'
const userStore = UserStore();

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })


const props = defineProps({
  signal:String
})

/*
const cats = computed(() => {

})
*/

const conscolor = computed(() => { return consent.value ? "danger" : "primary"})

const fullsize = ref()
const consent = ref()


onMounted(async () => {
  // load from store
  consent.value = await userStore.getConsent()
  fullsize.value = await userStore.getFullsize()
  console.log("Old Settings:",consent.value,fullsize.value)
})

const close = async () => {
  console.log("Update with:",consent.value,fullsize.value)
  await userStore.setConsent(consent.value)
  await userStore.setFullsize(fullsize.value)
  await eventBus.emit(props.signal, {"id":"close"});
}

</script>

<style>


</style>

<style scoped>


ion-buttons {
  /*
  overflow:scroll;
  */
}

ion-content.settingsPop {
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

ion-content.settingsPop ion-content {
  height: calc(80vh - 20px);
  width: calc(100vw - 20px);
  --height: calc(80vh - 20px);
  --width: calc(100vw - 20px);
  overflow: clip;
}

ion-content.ion-content::part(scroll) {
  overflow:scroll;
  }

.settingsPop {
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

