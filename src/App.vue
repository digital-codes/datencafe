<template>
  <ion-app>
    <!-- DONT use a second router-outlete here. Ever! -->
    <!-- 
    <div v-if='route.name == "PrintPage"' class="print">
      <PrintPage></PrintPage>
    </div>
    <div v-else class="screen">

    -->

    <!-- 
    <div>
      <ion-split-pane when="(min-width: 4000px)" content-id="main-content" :class='route.name != "PrintPage"?"screen":"print"'>
        <MainMenu v-if='route.name != "PrintPage"'/>
        <TitleBar2 v-if='route.name != "PrintPage"'/>
          <ion-router-outlet
            id="main-content"
            animated="false"
          ></ion-router-outlet>

      </ion-split-pane>
    </div>

    -->
    <!-- with split pane
      <ion-split-pane when="(min-width: 4000px)" content-id="main-content" :class='route.name != "PrintPage"?"screen":"print"'>
        <MainMenu v-if='route.name != "PrintPage"'/>
        <TitleBar2 v-if='route.name != "PrintPage"'/>
          <ion-router-outlet
            id="main-content"
            animated="false"
          ></ion-router-outlet>

      </ion-split-pane>
    -->
    <div :class='route.name != "PrintPage"?"screen":"print"'>
        <MainMenu v-if='route.name != "PrintPage"'/>
        <TitleBar2 v-if='route.name != "PrintPage"'/>
          <ion-router-outlet :class='route.name != "PrintPage"?"screen":"print"'
            id="main-content"
            animated="false"
          ></ion-router-outlet>
    </div>
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from "vue";
import { UserStore, Modes } from "@/services/UserStore";
const userStore = UserStore();

import { PreFixes } from "@/services/GlobalDefs";

import { useI18n } from "vue-i18n";
const { locale } = useI18n({ useScope: "global" });
 
 import { IonHeader, IonTitle, IonToolbar } from '@ionic/vue';

import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
} from "@ionic/vue";

import MainMenu from "@/components/MainMenu.vue";
import TitleBar2 from "@/components/TitleBar2.vue";
import PrintPage from "@/views/PrintPage.vue";

// prerelase state
provide('prerelease', true)



// do not track ...
onMounted(async () => {
  console.log("DNT:", navigator.doNotTrack);
  await userStore.clear();
  await userStore.setLang(locale.value);
  await checkLSToken();
  const mediaQueryObj = window.matchMedia("(prefers-color-scheme: dark)");
  const isDarkMode = mediaQueryObj.matches;
  if (isDarkMode) {
    console.log("Dark");
    await userStore.setDark(Modes.Dark);
  }
});

// check if we have a token in localstorage for this domain
const checkLSToken = async () => {
  try {
    const tok = await localStorage.getItem(PreFixes.LSTOKPREFIX);
    const key = await localStorage.getItem(PreFixes.LSKEYPREFIX);
    const loc = await localStorage.getItem(PreFixes.LSLOCPREFIX);
    if (tok === null || key === null || loc === null) {
      console.log("LS empty");
      return;
    }
    const current = window.location.hostname;
    if (current != loc) {
      console.log("LS wrong");
      await userStore.setToken(""); // clear
      return;
    }
    await userStore.setToken(tok, key);
    console.log("Token set");
  } catch (e) {
    console.log("LS error", e);
    await userStore.setToken(""); // clear
    return;
  }
};

// test swiping. works. move to app ...
import { createGesture } from "@ionic/vue";
import { useRoute } from "vue-router";
import router from "@/router";
const route = useRoute();


const gesture = ref();
const forceMobile = true;
const debounce = ref(false);
onMounted(() => {
  if (
    forceMobile ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // Code to run if the app is running on a mobile device
    console.log("Running on a mobile device.");

    const swipe = document.getElementById("main-content");
    console.log("swipe target:", swipe);
    gesture.value = createGesture({
      el: swipe,
      onMove: (detail) => {
        onMove(detail);
      },
    });

    gesture.value.enable();
  }
  // get  app id from user store
  const appId = userStore.getAppId()
  console.log("ID:",appId)

});

const onMove = (detail) => {
  //const type = detail.type;
  //const currentX = detail.currentX;
  //const deltaX = detail.deltaX;
  //const velocityX = detail.velocityX;
  const current = route.name;
  // debounce. first
  if (debounce.value) return;
  debounce.value = true;
  setTimeout(() => {
    debounce.value = false;
  }, 250);
  //
  console.log("Swiped:", current, detail);

  let left = "";
  let right = "";
  switch (route.name) {
    case "Info":
      left = "";
      right = "Data";
      break;
    case "Data":
      left = "Info";
      right = "Stories";
      break;
    case "Stories":
      left = "Data";
      right = "Instructions";
      break;
    case "Instructions":
      left = "Data";
      right = "Workspace";
      break;
    case "Workspace":
      // check position here
      if (detail.currentY < 100) {
        left = "Instructions";
        right = "Advanced";
      } else {
        console.log("ignore");
      }
      break;
    case "Advanced":
      left = "Workspace";
      right = "Login";
      break;
    case "Login":
      left = "Advanced";
      right = "";
      break;
    default:
      break;
  }

  console.log(left, right);
  if (detail.type == "pan") {
    if (detail.velocityX > 1) {
      if (left > "") {
        router.push({ name: left });
      }
    }
    if (detail.velocityX < -1) {
      if (right > "") {
        router.push({ name: right });
      }
    }
  }
};
// --------------
</script>

<style>
/* global style prerelease */
.prerelease {
  font-size: 90%;
  font-weight:bold;
  color:var(--ion-color-danger);
  border:solid 1px var(--ion-color-primary-tint);
  padding:.3rem;
}

@media screen and (max-width: 600px) {
  .prerelease {
    font-size: 70%;
    padding:.2rem;
  }
}
</style>

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
</style>

<style scoped>
@media only print {
  article {
    page-break-after: always;
  }
  ion-card {
    page-break-after: always;
  }
}

@media only screen {
  .screen {
    display: block;
  }
  /*
  .print {
    display: none;
    height: 0;
    width: 0;
  }
  */
}
@media only print {
  @page {
    size: A4 portrait;
  }
/*
  .screen {
    display: none;
  }
  */
  .print {
    display: block;
    color: #000;
    background: #fff;
  }
  h2 {
    page-break-before: always;
  }
}
</style>
