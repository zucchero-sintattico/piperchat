<script setup lang="ts">
import {
  SessionControllerImpl,
  type SessionController
} from '@/controllers/session/session-controller'
import { useUserStore, ContentArea } from '@/stores/user'
import { computed, onMounted, onUnmounted, watch } from 'vue'
const userStore = useUserStore()
const toShow = computed(() => userStore.inContentArea == ContentArea.Multimedia)

const jwtToken = localStorage.getItem('jwt')
const sessionController: SessionController = new SessionControllerImpl(jwtToken || '')

let myStream: MediaStream | null = null

watch(toShow, async (inWebrtc) => {
  if (inWebrtc) {
    console.log('getting stream')
    myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
  } else {
    console.log('closing stream')
    myStream?.getTracks().forEach((track) => track.stop())
    myStream = null
  }
})
</script>

<template>
  <q-page-container padding v-if="toShow">
    <q-page>
      <div v-if="toShow">
        <video ref="localVideo" autoplay></video>
        <video ref="remoteVideo" autoplay></video>
      </div>
    </q-page>
  </q-page-container>
</template>
