<template>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button color="primary"></ion-menu-button>
          </ion-buttons>
          <ion-title>{{ props.title }}</ion-title>
        </ion-toolbar>
      </ion-header>
  </template>
  
  <script setup lang="ts">
  import { IonButtons, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
  import {defineProps} from "vue"

  const props = defineProps({
  title:String
})

  </script>
  
  <style scoped>

</style>
  