<template>
  <ion-page>
    <main>
      <article>
      <div v-html="parms.content" class="content">
      </div>
    </article>
    </main>
  </ion-page>
</template>

<script setup lang="ts">

import { IonButton, IonContent, IonHeader, IonButtons, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'
import { IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/vue';
import { ref, computed, watch, onMounted } from 'vue';

import { useRoute } from 'vue-router';
const route = useRoute()

import { PrintStore } from "@/services/PrintStore"
const printStore = PrintStore()

const props = defineProps(
  ["title","content"]
)


const parms = computed(() => {
  const c = printStore.get()
  console.log("content", c.length)
  return {
    content:c
  }
})

watch(
      () => printStore.get,
      (content) => {
        console.log("content", content.length)
      }
    )


</script>

<style scoped>

h2 {
  page-break-before: always;
}

.ion-page {
  overflow: auto;
  display: block;
}

.doclogo {
  width: 50%;
  margin-left:auto;
  margin-right:auto;
}

.docimg {
  width: 20%;
}

</style>

<style scoped>
@media print {
  @page {
    size: A4 portrait; /* change to desired paper size and orientation */
    margin: 1cm; /* change to desired margin size */
  }  

  h2 {
    page-break-before: always;
  }

  .ion-page {
    overflow: auto;
    display: block;
  }

  .doclogo {
    width: 50%;
    margin-left:auto;
    margin-right:auto;
  }

  .docimg {
    width: 20%;
  }

}

</style>
