<template>
  <ion-page>
    <TitleBar :title='$t("titles.stories")' thumb="book-open"/>

    <ion-content :fullscreen="true">

      <div id="container">

        <ion-card color="light" v-for="(item,i) in items.en" :key="i">
          <article>
            <ion-card-header>
            <ion-card-title>{{ getItem(i,"title") }}</ion-card-title>
            <div class="image" v-if="item.icon > ''">
            <ion-img :src="item.icon" :alt="item.alt"></ion-img>
            </div>
            <ion-item>
            <!-- 
              <ion-thumbnail v-if="item.icon > ''" class="thumb">
                <img  :src="item.icon" />
            </ion-thumbnail>
            -->
            <ion-card-subtitle>{{ getItem(i,"date") }}, {{ getItem(i,"author") }}, 
              <a :href='"mailto:" +  getItem(i,"email")'>{{ getItem(i,"email") }}</a>
            </ion-card-subtitle>
          </ion-item>
          </ion-card-header>

          <ion-card-content class="mdWrap">
            <div v-html="getItem(i,'html')" class="tutor">
          </div>

        </ion-card-content>
        <ion-card-header>
            <ion-button v-if="item.link > ''" _target="blank" :download="item.link.split('/')[3]" :href="item.link">{{$t('download')}}</ion-button>
            <!-- 
            <ion-button v-if="s.link == ''" @click="clicked(i)">{{$t('download')}}</ion-button>
            -->
          </ion-card-header>
          <ion-note v-if="item.link > ''">
            {{$t('downloadHint')}} 
          </ion-note>

        </article>
        </ion-card>

        <!-- use en as default to get length of storylist -->
        <!-- 
        <ion-card color="light" v-for="(s,i) in storyItems.en" :key="i">
          <article>
          <ion-card-header>
            <ion-card-title>{{ storyItem(i,"title") }}</ion-card-title>
            <ion-item>
              <ion-thumbnail v-if="s.icon > ''" class="thumb">
                <img  :src="s.icon" />
            </ion-thumbnail>
            <ion-card-subtitle>{{ storyItem(i,"date") }}, {{ storyItem(i,"author") }}, 
              <a :href='"mailto:" +  storyItem(i,"email")'>{{ storyItem(i,"email") }}</a>
            </ion-card-subtitle>
          </ion-item>
          </ion-card-header>

          <ion-card-content>
            {{ storyItem(i,"body") }}
          </ion-card-content>
          <ion-card-header>
            <ion-button v-if="s.link > ''" _target="blank" :download="s.link.split('/')[2]" :href="s.link">{{$t('download')}}</ion-button>
          </ion-card-header>
          <ion-note v-if="s.link > ''">
            {{$t('downloadHint')}} 
          </ion-note>
        </article>
        </ion-card>

        -->
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonButton, IonItem, IonThumbail, IonNote } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'
import TitleBar from "@/components/TitleBar.vue"


// https://lokalise.com/blog/vue-i18n/
// if we need translation inside methods, import this as well:
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

import items from "@/assets/stories/stories-md.json"

/*
import storyItems from "@/assets/stories/stories.json"
const storyItem = (idx,id) => {
  //console.log(idx,id,locale.value)
  //console.log(storyItems[locale.value])
  const text = storyItems[locale.value][idx][id]
  return text
}
*/
const getItem = (idx,id) => {
  const text = items[locale.value][idx][id]
  return text
}


</script>

<style scoped>
#container {
  text-align: center;
  margin:10px;
  margin-left: auto;
  margin-right: auto;
  max-width: 996px;
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

.thumb {
  width: 6rem;
}

ion-card {
  margin-left: auto;
  margin-right: auto;
  max-width: 996px;

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

ion-card-content {
  text-align: justify;
}



</style>
