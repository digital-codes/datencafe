<template>
      <ion-header :translucent="false">
        <ion-toolbar class="toolbar">
          <ion-buttons slot="start">
            <ion-menu-button :auto-hide="true" color="primary"></ion-menu-button>
          </ion-buttons>

          <ion-buttons slot="start">
          <div class="title">
            <!-- 
            <font-awesome-icon class="logo" icon="fa-solid fa-mug-hot" size="2x" :style="{ color: 'red' }" />
            -->
            <ion-thumbnail class="logo" button router-link="/">
              <img alt="Daten.Cafe Logo" src="/img/logo/datencafe.svg" />
            </ion-thumbnail>
            <!-- 
            <font-awesome-icon :icon="thumb" size="1x" class="ion-hide-md-up"/>
            <font-awesome-icon :icon="thumb" size="xl" class="ion-hide-md-down"/>
            -->
            <div>
          <span class="headline ion-hide-sm-down">Daten.Cafe</span>
          <span class="version ion-hide-sm-down">{{Version}}</span>
          <!-- 
          <font-awesome-icon icon="fa-solid fa-caret-right" size="2x" class="ion-hide-sm-down"/>
          <span class="version ion-hide-sm-down">{{ $t(routeInfo.title) }}</span>
          -->
            </div>
          </div>
          </ion-buttons>

          <ion-buttons slot="end">
          <div>
            <!-- 
              <ion-item id="modeRef" >
                <font-awesome-icon :icon="['fas', 'sun']" size="1x" class="modeLbl left"/>
                <ion-toggle @ionChange="changeMode" :checked="dark1"></ion-toggle>
                <font-awesome-icon :icon="['fas', 'moon']" size="1x" class="modeLbl right"/>
              </ion-item>
            -->
              <ion-item id="modeRef" >
                <font-awesome-icon v-if="isDark" button @click="changeMode" :icon="['fas', 'sun']" size="1x" class="modeLbl"/>
                <font-awesome-icon v-if="!isDark" button @click="changeMode" :icon="['fas', 'moon']" size="1x" class="modeLbl"/>
              </ion-item>

            </div>
          </ion-buttons>

        <ion-buttons slot="end"  id="langRef">
            <div>
              <font-awesome-icon :icon="['fas', 'globe']" size="xl"/>
              <!-- 
              <ion-button @click="changeLanguage('en')">EN</ion-button>
              <ion-button @click="changeLanguage('de')">DE</ion-button>
              -->
            </div>
            
            <ion-list>
              <!-- 
              <ion-item>
                <ion-select placeholder="Lang" interface="popover" @ionChange="selectLanguage" v-model="langSel">
                  <ion-select-option v-for="(l,idx) in availableLocales" :key="idx" :value="langSel">{{upper(l)}}</ion-select-option>
                </ion-select>
              </ion-item>

              -->
              <ion-item>
                <ion-select :placeholder="language" interface="popover" @ionChange="selectLanguage" v-model="language">
                  <ion-select-option v-for="(l,idx) in availableLocales" :key="idx" :value="l">{{l}}</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>          
          </ion-buttons>

          <ion-buttons slot="end" class="lastItem" id="userRef" @click="userPop">
              <font-awesome-icon v-if="hasToken" :icon="['fas', 'user']" size="1x" class="tok"/>
              <font-awesome-icon v-else :icon="['fas', 'user-slash']" size="1x" class="notok"/>
          </ion-buttons>
            <!-- 
          <ion-buttons slot="end">
            <ion-menu-button :auto-hide="true" color="primary"></ion-menu-button>
          </ion-buttons>

            -->

        </ion-toolbar>
      <ion-toolbar class="ion-hide-sm-up toolbar-secondary">
        <div class="smallheader">
            <span class="headline-secondary">Daten.Cafe
            </span>
            <span>
              <font-awesome-icon :icon="routeInfo.thumb" size="sm"/>
            </span>
          </div>
      </ion-toolbar>
      </ion-header>

      <!-- tooltips not working together with buttons --> 
      <!--
      <ion-popover trigger="modeRef" trigger-action="hover" show-backdrop="false" size="auto" side="bottom" alignment="start">
              <ion-content class="ion-padding">{{ $t("tooltip.mode") }}</ion-content>
      </ion-popover>
      <ion-popover trigger="langRef" trigger-action="hover" show-backdrop="false" size="auto" side="bottom" alignment="start">
              <ion-content class="ion-padding">{{ $t("tooltip.lang") }}</ion-content>
      </ion-popover>
      -->
      <!-- 
      <ion-popover cssClass="custom-popover-class" trigger="userRef" trigger-action="click" show-backdrop="false" size="auto" side="bottom" alignment="start">
        <ion-content class="ion-padding">{{ $t(userText) }}</ion-content>
      </ion-popover>

      -->      


  </template>
  
  <script setup lang="ts">
  import { IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/vue';
  import { IonLabel, IonList, IonItem, IonToggle,  IonImage, IonThumbnail, IonSelect, IonSelectOption, } from '@ionic/vue';
  import { IonButton, IonContent, IonPopover } from '@ionic/vue';
  import { ref, computed, onMounted, watch, onBeforeMount } from "vue"
  import { popoverController } from '@ionic/vue';

    // stores
    import { Language } from '@/services/UserStore'

    import { Modes } from '@/services/UserStore'

    // user store
    import { UserStore } from '@/services/UserStore'
    const userStore = UserStore()

    // https://lokalise.com/blog/vue-i18n/
    import { useI18n } from 'vue-i18n'
    const { locale, availableLocales } = useI18n({ useScope: 'global' })

    // globals
    import { Version } from "@/services/GlobalDefs"

    import { useRoute } from 'vue-router';
    const route = useRoute()

    watch(
      () => route.name,
      (name) => {
        console.log(`route is now : ${name}`)
        language.value = userStore.getLang() 
      }
    )

    const routeInfo = computed(() => {
      switch (route.name) {
        case "Info":
          return {title:"titles.about", thumb:"coffee"}
        case "Data":
          return {title:"titles.data", thumb:"book-atlas"}
        case "Stories":
          return {title:"titles.advanced", thumb:"book-open"}
        case "Instructions":
          return {title:"titles.tutorial", thumb:"receipt"}
        case "Advanced":
          return {title:"titles.advanced", thumb:"rocket"}
        case "Workspace":
          return {title:"titles.work.tab", thumb:"wand-magic-sparkles"}
        case "Login":
         return {title:"titles.login", thumb:"user-secret"}
        default:
          return {title:"undefined", thumb:"question"}
      }
    })
    const props = defineProps({
    title:String,
    thumb:String
  })

  // thumbnail refs for popovers
  const thumbRef = ref() 



const thumb = ref(['fas', 'question'])
// init store on mount

const hasToken = computed(() => {
  return userStore.exists()
  })

const userText = computed(() => {
  return hasToken.value?"tooltip.signedin":"tooltip.signedout"
})

onBeforeMount(async () => {
  //await userStore.clear()
  //await selectLanguage()
  language.value = await userStore.getLang() 

  // read mode
  dark.value = userStore.getDark()
  
  thumb.value = (props.thumb === undefined)? thumb.value : ['fas', props.thumb]
  console.log(props,"Icon:",thumb.value)



})

  const language = ref(locale.value)

    const selectLanguage = () => {
      console.log("L:",language.value)
      userStore.setLang(language.value as Language)
      locale.value = userStore.getLang()
      console.log("Current lang:",locale.value)
    }

    // theme switch
    const dark = ref(Modes.Dark)
    const isDark = computed(() => (userStore.getDark() == Modes.Dark) )

    const changeMode = () => {
      console.log("Change mode, now ",dark.value)
      dark.value = (dark.value == Modes.Dark)?Modes.Light:Modes.Dark
      userStore.setDark(dark.value)
      if (userStore.getDark() == Modes.Dark) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
      // document.body.classList.toggle('dark', (theme.get() == Modes.Dark));
      console.log("Final mode is dark:",isDark.value)
    };    


    const popover = ref()

async function userPop() {
  await openPop()
}
import AccountPopover from "@/components/popovers/AccountPopover.vue"

const openPop = async (message:string) => {
  popover.value = await popoverController.create({
      component: AccountPopover,
      //event: ev,
      size: "auto",
      side:"bottom",
      alignment:"start",
      showBackdrop: false,
      backdropDismiss: true, 
      dismissOnSelect: true,
      reference: "trigger", // event or trigger
      componentProps: { // Popover props
          signal: "pop",
          message:userText.value
        }
    })
    await popover.value.present();
    popover.value.open = true
    const x = await popover.value.onDidDismiss();
    console.log("Dismiss: ",x)
    popover.value.open = false
}


  </script>
  
<style scoped>
.navbar {
    padding-left:1rem;
    padding-right:1rem;
}

.title {
  padding:0;
  margin:0;
  padding-left:10px;
  margin-left: 10px;
  margin-right: auto;
  display: inline-flex;
  align-items: center;
}

ion-thumbnail.logo:hover {
  cursor: pointer;
}

ion-thumbnail.logo {
  --size:96px;
}


/* sm is 576, md is 768 */
@media only screen and (max-width: 768px) {
  .title {
    padding-left:0;
    margin-left:0;
  }

  ion-thumbnail.logo {
    --size:48px;
  }

  .custom-popover-class {
  --offset-y: 30px;
  }



}


.hamburger {
  margin:0;
  padding:0;
  margin-right:10px;
  padding-right:10px;
}
.headline {
    padding:10px;
    margin: 10px;
    margin-right: 0;
    padding-right: 0;
    font-size: 1.5rem;
    font-weight: 500;
    color: red;
}
.headline-secondary {
    padding:0px;
    margin: 0px;
    font-size: 1.5rem;
    font-weight: 500;
    color: red;
}
.version {
  padding:5px;
  margin: 5px;
  font-size: 1rem;
}
/* with with text: 3.5rem */
.modeLbl {
  width: 1.5rem;
}
.modeLbl.left {
  text-align: right;
}
.modeLbl.right {
  text-align: left;
}

.tok {
  color: var(--ion-color-primary);
}

.notok {
  color: var(--ion-color-warning-shade);
}


.toolbar-secondary {
  height: 48px;
}
.smallheader {
  text-align:center;
  padding-bottom: 10px;
  /*
  z-index:10;
  margin-top: 1rem;
  border-bottom: solid 2px var(--ion-color-primary);
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  */
}

.lastItem {
  margin-right: 1rem;
  margin-left: 1rem;
}

ion-toolbar {
  /*
    --background: var(--ion-color-light);
    */
    --background: var(--ion-background-color);
    --color: var(--ion-color-dark);
  }

</style>
  
