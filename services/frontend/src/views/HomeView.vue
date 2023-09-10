<script setup lang="tsx">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '../router/index'
import ServerList from '../components/home-component/ServerList.vue'
import DirectsList from '../components/home-component/DirectsList.vue'

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
  <q-layout view="hHh lpR lFf" class="bg-accent">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="src/assets/piperchat-logo.jpg" />
          </q-avatar>
          PiperChat
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab label="Pending" @click="toggleLeftOpen" />
        <q-route-tab label="Friends" @click="toggleLeftOpen" />
        <q-route-tab label="Pending" @click="toggleLeftOpen" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div class="row">

        <ServerList />


        <DirectsList />

      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
.row {
  height: 100%;
}
</style>
