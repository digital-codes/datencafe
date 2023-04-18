<template>
  <ion-content class="ion-padding ion-popover storyPop">
    <p>{{ labels[locale].fields.heading }}</p>
    <div>
      <ion-item >
        <ion-input type="text" :placeholder="labels[locale].fields.title" v-model="title" />
      </ion-item>
      <ion-item >
        <ion-input type="text" :placeholder="labels[locale].fields.author" v-model="author" />
        <!-- date set via current date below
        <ion-input type="text" :placeholder="labels[locale].fields.date" v-model="date" />
        -->
      </ion-item>
      <ion-item>
        <ion-input type="email" :placeholder="labels[locale].fields.email" v-model="email" />
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
      </ion-item>

      <ion-item>
      <ion-list class="list">
        <ion-label>{{ labels[locale].fields.tagLabel }}</ion-label>
        <ion-item>
        <ion-select multiple="true" :placeholder="labels[locale].fields.tags" v-model="tags">
        <ion-select-option v-for="(t,idx) in labels['en'].tags" :key="idx" :value="tg(idx)">{{tg(idx)}}</ion-select-option>
      </ion-select>
      </ion-item>
      </ion-list>
      </ion-item>
      <!-- 
      <ion-label>Story</ion-label>
      -->
      <ion-item class="storyItem">
      <ion-textarea class="story" v-model="story" 
      :placeholder="labels[locale].fields.text" :auto-grow="true" maxlength=1000 wrap="soft" inputmode="text"
        :value="story">
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
  const oldStory = await userStore.getStory()
  console.log("Old Story:",story)
  title.value = oldStory.title 
  author.value = oldStory.author 
  email.value = oldStory.email
  date.value = oldStory.date
  link.value = oldStory.link
  story.value = oldStory.text
  category.value = oldStory.category
  tags.value = oldStory.tags
  //props.options.forEach(e => vals.value.push(e.value))
})

const close = async () => {
  //console.log('close')
  const dt = await new Date()
  const data = {
    "title":title.value,
    "author":author.value,
    "email":email.value,
    "date":dt.toISOString(),
    "link":link.value,
    "tags":tags.value,
    "category":category.value,
    "story":story.value
  }
  console.log("Update with:",data)
  await userStore.setTitle(title.value)
  await userStore.setAuthor(author.value)
  await userStore.setDate(data.date)
  await userStore.setEmail(email.value)
  await userStore.setLink(link.value)
  await userStore.setCategory(category.value)
  await userStore.setTags(tags.value)
  await userStore.setText(story.value)
  await eventBus.emit(props.signal, {"id":"close"});

}

</script>


<style scoped>

ion-buttons {
  /*
  overflow:scroll;
  */
}

ion-popover.storyPop {
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

ion-popover.storyPop ion-content {
  height: calc(80vh - 20px);
  width: calc(100vw - 20px);
  --height: calc(80vh - 20px);
  --width: calc(100vw - 20px);
  overflow: clip;
}

ion-content.ion-popover::part(scroll) {
  overflow:scroll;
  }

.storyPop {
  min-width:300px;
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

