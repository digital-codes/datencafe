<template>
        <ion-menu content-id="main-content" type="overlay">
          <ion-content>
            <ion-list id="inbox-list">
              <ion-list-header>Pages</ion-list-header>

              <ion-menu-toggle auto-hide="false">
                <!-- 
                <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
                -->
                <ion-item router-link="/info" lines="none" >
                  <font-awesome-icon aria-hidden="true" :icon="['fas', 'coffee']" slot="start" />
                  <ion-label>{{$t("titles.about")}}</ion-label>
                  <!-- 
                  <ion-button router-link="/home" router-direction="forward">Home</ion-button>
                  -->
                </ion-item>
                <ion-item router-link="/open" lines="none" >
                  <font-awesome-icon aria-hidden="true" :icon="['fas', 'book-atlas']" slot="start" />
                  <ion-label>{{$t("titles.data")}}</ion-label>
                  <!-- 
                  <ion-button router-link="/other">Home</ion-button>
                  -->
                </ion-item>
                <ion-item router-link="/stories" lines="none" >
                  <font-awesome-icon aria-hidden="true" :icon="['fas', 'book-open']" slot="start" />
                  <ion-label>{{$t("titles.stories")}}</ion-label>
                </ion-item>
                <ion-item router-link="/work" lines="none" >
                  <font-awesome-icon aria-hidden="true" :icon="['fas', 'wand-magic-sparkles']" slot="start" />
                  <ion-label>
                    {{$t("titles.work.tab")}}
                  </ion-label>
                </ion-item>
                <ion-item router-link="/instructions" lines="none" >
                  <font-awesome-icon aria-hidden="true" :icon="['fas', 'graduation-cap']" slot="start" />
                  <ion-label>{{$t("titles.tutorial")}}</ion-label>
                </ion-item>
                <ion-item router-link="/login" lines="none" >
                  <font-awesome-icon aria-hidden="true" :icon="['fas', 'user-secret']" slot="start" />
                  <ion-label>{{$t("titles.login")}}</ion-label>
                </ion-item>


              </ion-menu-toggle>
            </ion-list>
  
          </ion-content>
        </ion-menu>
  </template>
  
  <script setup lang="ts">
  import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonRouterOutlet,
  } from '@ionic/vue';
  import { ref } from 'vue';
  import {
    heartSharp,
    trashSharp,
  } from 'ionicons/icons';
  
  </script>
  
  <style scoped>
  ion-menu ion-content {
    --background: var(--ion-item-background, var(--ion-background-color, #fff));
  }
  
  ion-menu.md ion-content {
    --padding-start: 8px;
    --padding-end: 8px;
    --padding-top: 20px;
    --padding-bottom: 20px;
  }
  
  ion-menu.md ion-list {
    padding: 20px 0;
  }
  
  ion-menu.md ion-note {
    margin-bottom: 30px;
  }
  
  ion-menu.md ion-list-header,
  ion-menu.md ion-note {
    padding-left: 10px;
  }
  
  ion-menu.md ion-list#inbox-list {
    border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
  }
  
  ion-menu.md ion-list#inbox-list ion-list-header {
    font-size: 22px;
    font-weight: 600;
  
    min-height: 20px;
  }
  
  ion-menu.md ion-list#labels-list ion-list-header {
    font-size: 16px;
  
    margin-bottom: 18px;
  
    color: #757575;
  
    min-height: 26px;
  }
  
  ion-menu.md ion-item {
    --padding-start: 10px;
    --padding-end: 10px;
    border-radius: 4px;
  }
  
  ion-menu.md ion-item.selected {
    --background: rgba(var(--ion-color-primary-rgb), 0.14);
  }
  
  ion-menu.md ion-item.selected ion-icon {
    color: var(--ion-color-primary);
  }
  
  ion-menu.md ion-item ion-icon {
    color: #616e7e;
  }
  
  ion-menu.md ion-item ion-label {
    font-weight: 500;
  }
  
  ion-menu.ios ion-content {
    --padding-bottom: 20px;
  }
  
  ion-menu.ios ion-list {
    padding: 20px 0 0 0;
  }
  
  ion-menu.ios ion-note {
    line-height: 24px;
    margin-bottom: 20px;
  }
  
  ion-menu.ios ion-item {
    --padding-start: 16px;
    --padding-end: 16px;
    --min-height: 50px;
  }
  
  ion-menu.ios ion-item.selected ion-icon {
    color: var(--ion-color-primary);
  }
  
  ion-menu.ios ion-item ion-icon {
    font-size: 24px;
    color: #73849a;
  }
  
  ion-menu.ios ion-list#labels-list ion-list-header {
    margin-bottom: 8px;
  }
  
  ion-menu.ios ion-list-header,
  ion-menu.ios ion-note {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  ion-menu.ios ion-note {
    margin-bottom: 8px;
  }
  
  ion-note {
    display: inline-block;
    font-size: 16px;
  
    color: var(--ion-color-medium-shade);
  }
  
  ion-item.selected {
    --color: var(--ion-color-primary);
  }

  .patience {
    --color: var(--ion-color-warning-shade);
    --background-color:var(--ion-color-medium-shade);
    font-size:90%;
    margin-left: 20%;
  }
  </style>
  
