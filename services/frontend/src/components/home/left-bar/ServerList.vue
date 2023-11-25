<script setup lang="ts">
import { ref } from 'vue'
import NewServerForm from './form/NewServerForm.vue'
import { useServerStore } from '@/stores/server'
import BottomPopUp from '@/components/utils/BottomPopUp.vue'
import { BannerColor } from '@/components/utils/BannerColor'
import { useAppStore } from '@/stores/app'

const serverStore = useServerStore()
const appStore = useAppStore()

const isNewServerFormActive = ref(false)

const BANNER_TIMEOUT = 3000
const resultBanner = ref(false)
const colorBanner = ref(BannerColor.OK)
const contentBanner = ref('')
function popUpBanner(content: string, error?: string) {
  if (error) {
    colorBanner.value = BannerColor.ERROR
    contentBanner.value = error
  } else {
    colorBanner.value = BannerColor.OK
    contentBanner.value = content
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
      <q-btn size="20px" color="primary" round icon="chat" @click="appStore.setDirects" />
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
            @click="appStore.selectServer(server)"
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
