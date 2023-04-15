<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ $t("flow.cfg.params") }}</p>
    <div>
      <ion-item>
        <ion-input type="text" :placeholder="labels[locale].fields.title" v-model="title" />
        <ion-input type="text" :placeholder="labels[locale].fields.author" v-model="author" />
      </ion-item>
      <ion-item>
        <ion-input type="email" :placeholder="labels[locale].fields.email" v-model="email" />
      <ion-input type="text" :placeholder="labels[locale].fields.date" v-model="date" />
      </ion-item>
      <ion-item>
      <ion-list class="list">
        <ion-label>{{ labels[locale].fields.catLabel }}</ion-label>
    <ion-item>
      <ion-select :placeholder="labels[locale].fields.cats" v-model="category">
        <ion-select-option v-for="(c,idx) in labels['en'].categories.labels" :key="idx" :value="cats(idx).label">{{cats(idx).label}}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-list>
  <ion-list class="list">
        <ion-label>{{ labels[locale].fields.tagLabel }}</ion-label>
    <ion-item>
      <ion-select multiple="true" :placeholder="labels[locale].fields.tags" v-model="tags">
        <ion-select-option v-for="(t,idx) in labels['en'].tags" :key="idx" :value="tg(idx)">{{tg(idx)}}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-list>
</ion-item>

      <ion-label>Story</ion-label>
      <ion-item class="storyItem">
      <ion-textarea class="story" v-model="story" 
        placeholder="Type something here" :auto-grow="true" maxlength=1000 wrap="soft" inputmode="text"
        value="">
      </ion-textarea>
  </ion-item>
    <ion-button @click="close">{{$t("flow.cfg.close")}}</ion-button>
    </div>
</ion-content>
</template>

<script lang="ts" setup>
/**
 * handles multiple options
 * returns single item on update  
 * teminates on close (no data)
 * 
 */ 
import { IonContent, IonButton } from '@ionic/vue';
import { IonLabel, IonItem, IonInput, IonTextarea } from '@ionic/vue';
import { IonList, IonSelect, IonSelectOption } from '@ionic/vue';

import { ref, onMounted, computed } from "vue"

import eventBus from '@/services/eventBus';

import { UserStore, UserInfo } from '@/services/UserStore'
const userStore = UserStore();

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

import labels from "@/assets/stories/catsAndTags.json" 

const title = ref("")
const author = ref("")
const email = ref("")
const date = ref("")
const link = ref("")
const story = ref("")
const category = ref("")
const tags = ref([])

const props = defineProps({
  signal:String
})

/*
const cats = computed(() => {

})
*/

const cats = (idx) => {
  const cat = {"label":labels[locale.value].categories.labels[idx],
  "icon":labels[locale.value].categories.icons[idx]
  }
  return cat
}
const tg = (idx) => {
  const tag = labels[locale.value].tags[idx]
  return tag
}



onMounted(async () => {
  // load from store
  const story = await userStore.getStory()
  console.log("Old Story:",story)
  title.value = story.title 
  author.value = story.author 
  email.value = story.email
  date.value = story.date
  link.value = story.link
  story.value = story.text
  category.value = story.category
  tags.value = story.tags
  //props.options.forEach(e => vals.value.push(e.value))
  console.log("tags: ${tags}, cats: ${categories}")
})

const close = async () => {
  //console.log('close')
  const data = {
    "title":title.value,
    "author":author.value,
    "email":email.value,
    "date":date.value,
    "link":link.value,
    "tags":tags.value,
    "category":category.value,
    "story":story.value
  }
  console.log("Update with:",data)
  await userStore.setTitle(title.value)
  await userStore.setAuthor(author.value)
  await userStore.setDate(date.value)
  await userStore.setEmail(email.value)
  await userStore.setLink(link.value)
  await userStore.setCategory(category.value)
  await userStore.setTags(tags.value)
  await userStore.setText(story.value)
  await eventBus.emit(props.signal, {"id":"close"});

}

</script>


<style>

ion-buttons {
  /*
  overflow:scroll;
  */
}

ion-popover {
  margin:5px;
  --width: auto;
  --height: auto;
  /*
  --width: auto;
  --height: auto;
  --min-width: 200px;
  --min-height: 200px;
  --max-height: calc(100vh - 100px);
  --max-width: calc(100vw - 30px);
  */
}

ion-popover ion-content {
  max-height: calc(80vh - 100px);
  width: calc(100vw - 200px);
  overflow: clip;
}

ion-content.ion-popover::part(scroll) {
  overflow:clip;
  }

textarea {
  overflow: scroll;

}
.storyItem {
  max-height: 100px;
}
.story {
}

.list {
  width:48%;
}

</style>

