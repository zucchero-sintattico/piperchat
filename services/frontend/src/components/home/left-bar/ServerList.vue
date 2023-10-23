<script setup lang="ts">
import { ref } from 'vue'
import NewServerForm from './form/NewServerForm.vue'
import { SelectedTab, useUserStore } from '@/stores/user'
import { useServerStore } from '@/stores/server'
import type { GetServersApi } from '@api/piperchat/server'
import BottomPopUp from '@/components/utils/BottomPopUp.vue'
import { BannerColor } from '@/components/utils/BannerColor'

const userStore = useUserStore()
const serverStore = useServerStore()

const isNewServerFormActive = ref(false)

function setActiveServer(server: GetServersApi.Responses.Server) {
  userStore.selectedServerId = server.id
  userStore.selectedTab = SelectedTab.Servers
}

const BANNER_TIMEOUT = 3000
const resultBanner = ref(false)
const colorBanner = ref(BannerColor.OK)
const contentBanner = ref('')
function popUpBanner(error?: string) {
  if (error) {
    colorBanner.value = BannerColor.ERROR
    contentBanner.value = error
  } else {
    colorBanner.value = BannerColor.OK
    contentBanner.value = 'Server created successfully'
  }
  resultBanner.value = true
  setTimeout(() => {
    resultBanner.value = false
  }, BANNER_TIMEOUT)
  isNewServerFormActive.value = false
}
</script>

<template>
  <div class="column">
    <q-item>
      <q-btn
        size="20px"
        color="primary"
        round
        icon="chat"
        @click="userStore.selectedTab = SelectedTab.Directs"
      />
    </q-item>

    <q-separator color="accent" style="height: 2px" inset />

    <!-- start Create new server -->
    <q-item>
      <q-btn size="20px" color="primary" round icon="add" @click="isNewServerFormActive = true" />
    </q-item>

    <BottomPopUp v-model:active="resultBanner" :content="contentBanner" :color="colorBanner" />

    <q-dialog
      v-model="isNewServerFormActive"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <NewServerForm @close="isNewServerFormActive = false" @result="popUpBanner($event)" />
    </q-dialog>
    <!-- end Create new server -->

    <q-separator color="accent" style="height: 1px" inset />

    <q-scroll-area visible class="col bg-dark">
      <div v-for="server in serverStore.servers" :key="server.id" class="col">
        <q-item>
          <q-btn
            size="20px"
            color="accent"
            round
            :label="server.name.charAt(0).toUpperCase()"
            text-color="primary"
            @click="setActiveServer(server)"
          />
          <q-tooltip
            class="q-pa-md text-h4 bg-black"
            anchor="center right"
            self="center start"
            transition-duration="0"
          >
            {{ server.name }}
          </q-tooltip>
        </q-item>
      </div>
    </q-scroll-area>
  </div>
</template>
