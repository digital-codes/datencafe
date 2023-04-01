<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $t("titles.login") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

        <div id="container">
        <!-- use en as default to get length of storylist -->
        <ion-card color="light" >
          <ion-card-header>
            <ion-card-title>{{ $t("login.titel") }}</ion-card-title>
            <ion-card-subtitle>
              {{ $t("login.register") }} 
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>

          <div class="ion-padding">
            <form @submit.prevent="submitForm">

              <ion-item>
                <ion-label position="floating">{{ $t("login.email") }}</ion-label>
                <ion-input v-model="form.username" type="email"></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="floating">{{ $t("login.pwd") }}</ion-label>
                <ion-input v-model="form.password" type="password"></ion-input>
              </ion-item>

              <ion-button type="submit" expand="block">{{ $t("login.submit") }}</ion-button>
            </form>
          </div>

          <p v-if="loginGood" class="loginGood">{{ $t("login.good") }}</p>
          <p v-if="loginBad" class="loginBad">{{ $t("login.bad") }}</p>
          </ion-card-content>
        </ion-card>
      </div>

      {{ userStore.exists() }}
      {{ userStore.token() }}

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'
import { IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/vue';

// user store
import { UserStore, UserInfo } from '../services/UserStore'

import { ref, onMounted } from 'vue';

const loginGood = ref(false)
const loginBad = ref(false)

const form = ref({
  username: '',
  password: '',
});


const submitForm = () => {

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  };

  fetch('http://localhost:9000/php/corsProxyLogin.php', requestOptions)
  .then(response => {
    if (!response.ok) {
      loginBad.value = true
      loginGood.value = false
      userStore.clear()
      throw new Error('Network response was not ok: ' + String(response.status));
   }
   return response.text();
  })
  .then(data => {
    console.log(data);
    const token = JSON.parse(data)
    console.log(token)
    loginGood.value = true
    loginBad.value = false
    userStore.set(token)
  })
  .catch(error => {
    loginGood.value = false
    loginBad.value = true
    userStore.clear()
    console.error('There was an error:', error);
  });
};

const userStore = UserStore()

// init store on mount
onMounted(() => {
  userStore.clear()
})


</script>

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

.loginGood {
  color:#000!important;
  background: #0c0;
}

.loginBad {
  color:#000!important;
  background: #c00;
}


</style>
