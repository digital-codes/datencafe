<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Info</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong class="capitalize">{{ $route.params.id }}</strong>
        <p>{{ $t("titles.info") }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';

// stores
/*
import { langStore } from '../services/store'
import { Language } from '../services/store'
const language = langStore()
console.log("Info lang:",language.lang)
*/

/*
import { providerStore, Provider } from '../services/srcStore';
const providers = providerStore();
console.log("Prv:",providers.getSrcDataById("a"))
*/

import { CsvNode } from "../classes/CsvNode"
try {
  const _nd = new CsvNode() // should fail without id
} catch (e) {
  console.log("Intentionally failed: ",e.message)
}
const nd = new CsvNode("P1")
nd.name = "XYZ"
console.log("ID:",nd.id)
console.log("Name:",nd.name)
try {
  nd.id = "17"
} catch (e) {
  console.log("Intentionally failed: ",e.message)
}
nd.run()
nd.run(1,2)

const ev = (a:string,b:number) => {
  console.log("string:",a)
  console.log("number:",b)
  return 2 * b
}

nd.setFunction(ev)
console.log("Node:", nd.json())

let r
r = nd.run("XNKN",5)
console.log("Result:",r)
r = nd.run()
console.log("Result:",r)
r = nd.run(1,2)
console.log("Result:",r)


</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
