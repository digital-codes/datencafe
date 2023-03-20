<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Data</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-grid fixed="true">
          <ion-row>
            <ion-col size="7">
              Flow
              <CytoFlow msg="Flow demo" />
            </ion-col>
            <ion-col size="5" sytle="overflow-y:scroll;">
              Viz
              <!--VizPage /-->
            </ion-col>
          </ion-row>
          </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCol, IonGrid, IonRow } from '@ionic/vue';
import CytoFlow from '../components/CytoFlow.vue'

import VizPage from './VizPage.vue'

// ----------------------------------------------------------------
// text search test
import * as dfd from 'danfojs/dist/danfojs-browser/src';
import stringSimilarity from 'string-similarity';

try {
  const data = {
  "title": ["The Hitchhiker's Guide to the Galaxy", "The Lord of the Rings", "Harry Potter and the Sorcerer's Stone", "To Kill a Mockingbird"],
  "author": ["Douglas Adams", "J.R.R. Tolkien", "J.K. Rowling", "Harper Lee"],
  "year": [1979, 1954, 1997, 1960]
};

const df = new dfd.DataFrame(data);

// Find best match for "Lord of the Rings" in the "title" column
const matches = stringSimilarity.findBestMatch("Lord of the Rings", df.title.values);
console.log(matches);
console.log(matches.bestMatch);
console.log(matches);

} catch (e) {
  console.log("Failed:",e)
}



console.log(stringSimilarity.compareTwoStrings("healed", "sealed"))
// → 0.8

console.log(stringSimilarity.compareTwoStrings(
  "Olive-green table for sale, in extremely good condition.",
  "For sale: table in very good  condition, olive green in colour."
))
// → 0.6060606060606061

console.log(stringSimilarity.compareTwoStrings(
  "Olive-green table for sale, in extremely good condition.",
  "For sale: green Subaru Impreza, 210,000 miles"
))
// → 0.2558139534883721

console.log(stringSimilarity.compareTwoStrings(
  "Olive-green table for sale, in extremely good condition.",
  "Wanted: mountain bike with at least 21 gears."
))
// → 0.1411764705882353


//////////////


</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  min-height:50%;
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

ion-grid {
    --ion-grid-width: 100%;
  }

</style>


