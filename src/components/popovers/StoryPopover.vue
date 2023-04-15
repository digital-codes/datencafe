<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ $t("flow.cfg.params") }}</p>
    <div>
      <ion-item>
        <ion-input type="text" placeholder="Title" v-model="title" />
        <ion-input type="text" placeholder="Name" v-model="author" />
      </ion-item>
      <ion-item>
        <ion-input type="email" placeholder="Email" v-model="email" />
      <ion-input type="text" placeholder="Date" v-model="date" />
      </ion-item>
      <ion-item>
      <ion-list class="list">
        <ion-label>Category</ion-label>
    <ion-item>
      <ion-select placeholder="Select fruit" v-model="category">
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="oranges">Oranges</ion-select-option>
        <ion-select-option value="bananas">Bananas</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-list>
  <ion-list class="list">
        <ion-label>Tags</ion-label>
    <ion-item>
      <ion-select multiple="true" placeholder="Select fruit" v-model="tags">
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="apples">Apples</ion-select-option>
        <ion-select-option value="oranges">Oranges</ion-select-option>
        <ion-select-option value="bananas">Bananas</ion-select-option>
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

import { ref, onMounted } from "vue"

import eventBus from '@/services/eventBus';

import { UserStore, UserInfo } from '@/services/UserStore'
const userStore = UserStore();


const title = ref("")
const story = ref("")
const tags = ref([])
const category = ref("")
const author = ref("")
const date = ref("")
const email = ref("")

const props = defineProps({
  signal:String
})

onMounted(async () => {
  // load from store
  const story = await userStore.getStory()
  title.value = story.title 
  author.value = story.author 
  email.value = story.email
  date.value = story.date
  category.value = story.category
  tags.value = story.tags
  story.value = story.text
  //props.options.forEach(e => vals.value.push(e.value))
})

const close = async () => {
  //console.log('close')
  const data = {
    "title":title.value,
    "author":author.value,
    "email":email.value,
    "date":date.value,
    "tags":tags.value,
    "category":category.value,
    "story":story.value
  }
  console.log(data)
  await userStore.setTitle(title.value)
  await userStore.setAuthor(author.value)
  await userStore.setDate(date.value)
  await userStore.setEmail(email.value)
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

