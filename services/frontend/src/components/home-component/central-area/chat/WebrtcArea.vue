<script setup lang="ts">
import {
  SessionControllerImpl,
  type SessionController
} from '@/controllers/session/session-controller'
import { useUserStore, ContentArea } from '@/stores/user'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
const userStore = useUserStore()
const toShow = computed(() => userStore.inContentArea == ContentArea.Multimedia)

const jwtToken = localStorage.getItem('jwt')
const sessionController: SessionController = new SessionControllerImpl(jwtToken || '')

const otherStreams: Record<string, MediaStream> = {}

let myStream = ref<MediaStream | null>(null)

watch(toShow, async (inWebrtc) => {
  if (inWebrtc) {
    console.log('getting stream')
    myStream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    const sessionHandler = await sessionController.joinChannel(
      userStore.selectedServerId,
      userStore.selectedChannel[1]
    )
    sessionHandler.start(
      myStream.value,
      (joinedUser, userStream) => {
        otherStreams[joinedUser] = userStream
      },
      (leftUser) => {
        delete otherStreams[leftUser]
      }
    )
  } else {
    console.log('closing stream')
    myStream.value?.getTracks().forEach((track) => track.stop())
    myStream.value = null
  }
})
</script>

<template>
  <q-page-container padding v-if="toShow">
    <q-page>
      <div v-if="toShow">
        <video ref="localVideo" autoplay :srcObject="myStream"></video>
        <video v-for="stream in otherStreams" :key="stream.id" :srcObject="stream" autoplay></video>
      </div>
    </q-page>
  </q-page-container>
</template>
