<template>

<ion-accordion-group class="popcontent">
  <ion-accordion value="source">
      <ion-item slot="header" color="light">
        <ion-label>{{$t("flow.select.grpsource")}}</ion-label>
      </ion-item>
      <div class="ion-no-padding" slot="content">
        <ion-list class="list" lines="none">
      <div class="item" slot="content" v-for="(option,idx) in options" :key="option.type">
      <ion-item v-if="option.implemented && (option.group == 'source')">
        <ion-thumbnail slot="start">
            <img :alt='option.type' :src="option.thumb" />
        </ion-thumbnail>
        <ion-checkbox slot="start" 
        :disabled="(option.consent && !consentOk)"
        v-model="chk[idx]" @ionChange="clk(idx)"></ion-checkbox>
        <ion-label class="label ion-hide-sm-down">
          {{ nodeItem(option.type,"label") }}
        </ion-label>
        <ion-note class="tooltip ion-hide-sm-down">
          {{ nodeItem(option.type,"info") }}
        </ion-note>
      </ion-item>
    </div>
    </ion-list>
  </div>
    </ion-accordion>
    <ion-accordion value="processing">
      <ion-item slot="header" color="light">
        <ion-label>{{$t("flow.select.grpprocessing")}}</ion-label>
      </ion-item>
      <div class="ion-no-padding" slot="content">
        <ion-list class="list" lines="none">
      <div class="item" slot="content" v-for="(option,idx) in options" :key="option.type">
      <ion-item v-if="option.implemented && (option.group == 'processing')">
        <ion-thumbnail slot="start">
            <img :alt='option.type' :src="option.thumb" />
        </ion-thumbnail>
        <ion-checkbox slot="start" 
        :disabled="(option.consent && !consentOk)"
        v-model="chk[idx]" @ionChange="clk(idx)"></ion-checkbox>
        <ion-label class="label ion-hide-sm-down">
          {{ nodeItem(option.type,"label") }}
        </ion-label>
        <ion-note class="tooltip ion-hide-sm-down">
          {{ nodeItem(option.type,"info") }}
        </ion-note>
      </ion-item>
    </div>
    </ion-list>
      </div>
    </ion-accordion>
    <ion-accordion value="display">
      <ion-item slot="header" color="light">
        <ion-label>{{$t("flow.select.grpdisplay")}}</ion-label>
      </ion-item>
      <div class="ion-no-padding" slot="content">
        <ion-list class="list" lines="none">
      <div class="item" slot="content" v-for="(option,idx) in options" :key="option.type">
      <ion-item v-if="option.implemented && (option.group == 'display')">
        <ion-thumbnail slot="start">
            <img :alt='option.type' :src="option.thumb" />
        </ion-thumbnail>
        <ion-checkbox slot="start" 
        :disabled="(option.consent && !consentOk)"
        v-model="chk[idx]" @ionChange="clk(idx)"></ion-checkbox>
        <ion-label class="label ion-hide-sm-down">
          {{ nodeItem(option.type,"label") }}
        </ion-label>
        <ion-note class="tooltip ion-hide-sm-down">
          {{ nodeItem(option.type,"info") }}
        </ion-note>
      </ion-item>
    </div>
    </ion-list>
      </div>
    </ion-accordion>
  </ion-accordion-group>

  <!-- 

    <ion-list class="list" lines="none">
      <div v-for="(option,idx) in options" :key="option.type" class="item">
      <ion-item v-if="option.implemented">
        <ion-thumbnail slot="start">
            <img :alt='option.type' :src="option.thumb" />
        </ion-thumbnail>
        <ion-checkbox slot="start" 
        :disabled="(option.consent && !consentOk)"
        v-model="chk[idx]" @ionChange="clk(idx)"></ion-checkbox>
        <ion-label class="label ion-hide-sm-down">
          {{ nodeItem(option.type,"label") }}
        </ion-label>
        <ion-note class="tooltip ion-hide-sm-down">
          {{ nodeItem(option.type,"info") }}
        </ion-note>
      </ion-item>
    </div>
    </ion-list>
  -->


</template>

<script lang="ts" setup>
import { IonContent, IonButton } from '@ionic/vue';
import { IonItem, IonLabel, IonList, IonCheckbox } from '@ionic/vue';
import { IonNote, IonThumbnail } from '@ionic/vue';
import { IonAccordion,IonAccordionGroup, } from '@ionic/vue';


import { ref, onMounted } from "vue"
import { UserStore, UserInfo } from '@/services/UserStore'
const userStore = UserStore();


import eventBus from '@/services/eventBus';

const props = defineProps({
  signal:String,
})

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

import nodeTypes from "@/assets/nodes/nodeTypes.json"
const nodeItem = (type,id) => {
  const text = nodeTypes[type][locale.value][id]
  return text
}

const options = ref([])

const chk = ref([])
const clk = async (n:number) => {
  console.log("clicked:",n)
  console.log(chk.value[n],options.value[n].type)
  if (chk.value[n]) {
    console.log('signal',props.signal)
    await eventBus.emit(props.signal, options.value[n].type);
  }
}

const consentOk = ref(false)

onMounted(async () => {
  consentOk.value = await userStore.getConsent()
  Object.keys(nodeTypes).forEach((e,i) => {
    chk.value[i] = false
    options.value[i] = {
      type: e, 
      icon: nodeTypes[e].icon, 
      thumb:nodeTypes[e].thumb,
      implemented:nodeTypes[e].implemented,
      group:nodeTypes[e].group,
      consent:nodeTypes[e].consent
     }
  })
})

</script>

<style>
.popover-viewport {
  min-width: calc(80vw);
}

</style>

<style scoped>
.popcontent {
  /*
  min-width: calc(60vw);
  */
}

ion-buttons {
  /*
  overflow:scroll;
  */
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
  /*
  --color: var(--ion-color-warning-shade);
  */
  --color: var(--ion-color-primary-shade);
  background-color: var(--ion-color-light);
  height: 0;
  font-size: 90%;
}

body.dark .tooltip {
  --color: var(--ion-color-success);
}

.item:hover .tooltip {
  visibility:visible;
  position: absolute;
  left: 0;
  top: 0;
  width:90%;
  height:100%;
  overflow-wrap: break-word;
  word-break:break-word;
  overflow: clip; 
}

ion-thumbnail {
  background: #fff;
}
ion-checkbox {
  /*
  background: var(--ion-color-light);
  border-color: var(--ion-color-dark);
  */
  background:#fff;
  border-color:#000;
  border-style: solid 2px;

}
/*
.checkbox-icon {
  background: var(--ion-color-light);
  border-color: var(--ion-color-dark);
  background:#fff;
  border-color:#000;
  border-style: solid 2px;
}
*/
.list {
  max-height: 200px;
  /* max-width: 400px;*/
  width:100%;
  overflow-x:hide;
  overflow-y: scroll;
  min-width: 14rem;
}

/* tooltip here ...
https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_tooltip
*/



</style>

