<template>
  <ion-page>
    <TitleBar :title='$t("titles.about")' thumb="coffee"/>

    <ion-content :fullscreen="true">

        <div id="container">
        <!-- use en as default to get length of storylist -->
        <!-- 
        <ion-button @click="f0">TF</ion-button>
         
        -->

        <ion-card color="light" v-for="(item,i) in infoItems.en" :key="i">
          <article>
            <ion-card-header>
            <ion-card-title>{{ infoItem(i,"title") }}</ion-card-title>
            <div class="image">
            <ion-img :src="item.image" :alt="item.alt"></ion-img>
            <ion-label class="attribution">{{item.attribution}}</ion-label>
            </div>
            <ion-card-subtitle>
              <p>{{ infoItem(i,"date") }} </p>
              <a v-if='infoItem(i,"link") > ""' :href='infoItem(i,"link")' target="_blank" >{{ infoItem(i,"link")  }}</a>
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            {{ infoItem(i,"body") }}
          </ion-card-content>
          </article>
        </ion-card>

      </div>


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonLabel, IonTitle, IonToolbar } from '@ionic/vue';
import { IonList, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'
import { IonButton } from '@ionic/vue'

import TitleBar from "@/components/TitleBar.vue"

// https://lokalise.com/blog/vue-i18n/
// if we need translation inside methods, import this as well:
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })


import infoItems from "@/assets/info/infoItems.json"
const infoItem = (idx,id) => {
  //console.log(idx,id,locale.value)
  //console.log(storyItems[locale.value])
  const text = infoItems[locale.value][idx][id]
  return text
}

// ----------------------------------------------

/*
// text utils
import {StringUtils} from "../services/StringUtils"

StringUtils.bestMatch("abc",["abd","cbc","cbd"])
StringUtils.compare("abc","cbc")


*/

/*
// tensor flow
import * as tf from '@tensorflow/tfjs';

const f0 = async () => {

  // Define the model architecture
  const model = await tf.sequential();
  await model.add(tf.layers.conv2d({
      filters: 16,
      kernelSize: 3,
      activation: 'relu',
      inputShape: [16, 16, 1]
  }));
  await model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  await model.add(tf.layers.flatten());
  await model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  await model.add(tf.layers.dense({ units: 2, activation: 'softmax' }));

  // Compile the model
  await model.compile({
      optimizer: 'sgd',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
  });

  const modelJson = await model.toJSON();

  // Sample training data
  // 4 examples
  const xIn = tf.tensor([
      // First 16x16 image
      [
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          // Rest of the first image
      ],
      // Second 16x16 image
      [
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          // Rest of the second image
      ],
      // Third 16x16 image
      [
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          // Rest of the third image
      ],
      // Fourth 16x16 image
      [
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
          [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
      ]
  ])

  const yIn = tf.tensor([
      [1, 0], // Circle
      [0, 1], // Square
      [0, 1], // Square
      [1, 0], // Circle
      // Rest of the training data
  ]);

  // Total number of training examples
  const numExamples = yIn.shape[0]; // returns 200 for example data
  console.log ("Samples:",numExamples)

  const numTestExamples = 2;
  const xTest = xIn.slice([0, 0], [numTestExamples, xIn.shape[1]]);
  const xTrain = xIn.slice([numTestExamples, 0], [-1, -1]);
  const yTest = yIn.slice([0, 0], [numTestExamples, yIn.shape[1]]);
  const yTrain = yIn.slice([numTestExamples, 0], [-1, -1]);


  // Train the model
  const history = await model.fit(xTrain, yTrain, {
      epochs: 10,
      validationData: [xTest, yTest],
      verbose: 1,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch+1} - loss: ${logs.loss.toFixed(4)} - acc: ${logs.acc.toFixed(4)} - val_loss: ${logs.val_loss.toFixed(4)} - val_acc: ${logs.val_acc.toFixed(4)}`);
        }
      }       
  });
  // Evaluate the model on a test dataset
  const evalResult = await model.evaluate(xTest, yTest);
  console.log(JSON.stringify({ model: modelJson, result: evalResult }))

}
*/

</script>

<style>
@media print {
  article {page-break-after: always;}
}
</style>
<style scoped>
#container {
  text-align: center;
  margin:10px;
  /*
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  */
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

.image {
  background-color: #ddd;
  opacity:.8;
  padding: 1rem;
  margin-top:1rem;

}


ion-img {
  height: 150px;
}

ion-label.attribution {
  font-size: 70%;
  color:#444;
  background: #eee;
}

ion-card {
  margin-left: auto;
  margin-right: auto;
  max-width: 996px;
}

ion-card-content {
  text-align: justify;
}

</style>
