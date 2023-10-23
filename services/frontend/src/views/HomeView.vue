<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '../router/index'
import LeftBar from '@/components/home/left-bar/LeftBar.vue'
import ContentArea from '@/components/home/central-area/ContentArea.vue'
import SettingsForm from '@/components/home/settings/SettingsForm.vue'
import { setCssVar } from 'quasar'
import { useNotificationService } from '@/controllers/notifications/notification-service'

const userStore = useUserStore()
const leftDrawerOpen = ref(false)
const isSettingsFormActive = ref(false)

setCssVar('primary', userStore.selectedTheme.primary)
setCssVar('secondary', userStore.selectedTheme.secondary)
setCssVar('accent', userStore.selectedTheme.accent)
setCssVar('dark', userStore.selectedTheme.dark)
useNotificationService()

function logout() {
  userStore.logout()
  router.push({ name: 'Login' })
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  userStore.inContentArea = ContentArea.Empty
  userStore.reload()
})
</script>

<template>
  <div @keydown.esc="userStore.inContentArea = ContentArea.empty">
    <q-layout view="hHh Lpr lff" class="bg-accent">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

          <q-toolbar-title align="center" class="title">
            <div class="avatar-and-title">
              <q-avatar>
                <img src="src/assets/piperchat-logo.jpg" />
              </q-avatar>
              <h1>Piperchat</h1>
            </div>
          </q-toolbar-title>

          <!--Avatar image that toggle dropdown menu with logout and settings option-->
          <q-avatar>
            <!-- add hover effect to image -->
            <img :src="userStore.photo" class="cursor-pointer" />
            <q-menu align="right">
              <q-list>
                <q-item clickable v-close-popup @click="isSettingsFormActive = true">
                  <!--Add settings icon on left and 'Settings' text on right-->
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>
                  <q-item-section> Settings </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section> Logout </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-avatar>
        </q-toolbar>
        <q-dialog
          v-model="isSettingsFormActive"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <SettingsForm @close="isSettingsFormActive = false" />
        </q-dialog>
      </q-header>

      <!-- pass leftDrawopen as props -->
      <LeftBar show-if-above v-model="leftDrawerOpen" side="left" bordered />

      <!--Use the rest part of the page to show ContentArea component-->
      <q-page-container class="full-height">
        <ContentArea />
        <!-- <router-view /> -->
      </q-page-container>
    </q-layout>
  </div>
</template>

<style>
.title {
  display: flex;
  justify-content: center;
  /* Center horizontally within q-toolbar-title */
}

.avatar-and-title {
  display: flex;
  align-items: center;
  /* Vertical alignment in the center */
}

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
