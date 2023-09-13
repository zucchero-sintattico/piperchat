<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '../router/index'
import ConversationBar from '@/components/home-component/left-bar/ConversationBar.vue'
import ContentArea from '@/components/home-component/ContentArea.vue'

const userStore = useUserStore()
const leftDrawerOpen = ref(false)

function logout() {
  userStore.logout()
  router.push({ name: 'Login' })
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleLeftOpen() {
  leftDrawerOpen.value = true
}
</script>

<template>
  <q-layout view="hHh Lpr lff" class="bg-accent">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-avatar>
          <img src="src/assets/piperchat-logo.jpg" />
        </q-avatar>

        <q-toolbar-title align="center" class="title">
          <h1>Piperchat</h1>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab label="Friends" @click="toggleLeftOpen" />
        <q-route-tab label="Pending" @click="toggleLeftOpen" />
      </q-tabs>
    </q-header>

    <!-- pass leftDrawopen as props -->
    <ConversationBar show-if-above v-model="leftDrawerOpen" side="left" bordered />

    <!--Use the rest part of the page to show ContentArea component-->
    <q-page-container class="full-height">
      <ContentArea />
      <!-- <router-view /> -->
    </q-page-container>
  </q-layout>
</template>

<style>
.left-menu {
  height: 100%;
}

.content-area {
  height: 100%;
}
h1 {
  font-size: x-large !important;
  line-height: normal !important;
  font-weight: 500 !important;
}
</style>
