<script setup lang="tsx">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '../router/index'

const userStore = useUserStore()
const leftDrawerOpen = ref(false)

function logout() {
  userStore.logout()
  router.push({ name: 'Login' })
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
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
        <q-route-tab label="Friends" />
        <q-route-tab label="All" />
        <q-route-tab label="Pending" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div class="row">
        <div class="col-4 bg-dark"></div>

        <div class="col-8 bg-secondary"></div>
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
