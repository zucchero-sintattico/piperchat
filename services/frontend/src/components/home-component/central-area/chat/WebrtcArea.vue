<script setup lang="ts">
import {
  SessionControllerImpl,
  type SessionController
} from '@/controllers/session/session-controller'
import { useUserStore, ContentArea } from '@/stores/user'
import { Cookies } from 'quasar'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
const userStore = useUserStore()
const toShow = computed(() => userStore.inContentArea == ContentArea.Multimedia)

const otherStreams = ref<Record<string, MediaStream>>({})

let myStream = ref<MediaStream | null>(null)

const allStreams = computed(() => {
  const streams: Record<string, MediaStream> = {}
  if (myStream.value) {
    streams['me'] = myStream.value
  }
  Object.assign(streams, otherStreams.value)
  return streams
})

let columns = computed(() => Math.min(2, Object.keys(allStreams.value).length / 2))

watch(toShow, async (inWebrtc) => {
  if (inWebrtc) {
    console.log('getting stream')
    myStream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    const jwtToken = userStore.jwt
    console.log('Token: ' + jwtToken)
    const sessionController: SessionController = new SessionControllerImpl(jwtToken || '')
    const sessionHandler = await sessionController.joinChannel(
      userStore.selectedServerId,
      userStore.selectedChannel[1]
    )
    sessionHandler.start(
      myStream.value,
      (newUser, userMediaStream) => {
        console.log('new user: ' + newUser)
        otherStreams.value[newUser] = userMediaStream
      },
      (userLeaving) => {
        console.log('user leaving: ' + userLeaving)
        delete otherStreams.value[userLeaving]
      }
    )
  } else {
    console.log('closing stream')
    myStream.value?.getTracks().forEach((track) => track.stop())
    myStream.value = null
  }
})

let mic_on = ref(true)
let cam_on = ref(true)

function toggleMicrophone() {
  if (myStream.value) {
    myStream.value.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled
      mic_on.value = !mic_on.value
    })
  }
}

function toggleWebcam() {
  if (myStream.value) {
    myStream.value.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled
      cam_on.value = !cam_on.value
    })
  }
}

function exitCall() {
  // TODO
}

const microphoneIcon = computed(() => {
  if (mic_on.value) {
    return 'mic'
  } else {
    return 'mic_off'
  }
})

const webcamIcon = computed(() => {
  if (cam_on.value) {
    return 'videocam'
  } else {
    return 'videocam_off'
  }
})
</script>

<template>
  <q-page-container padding v-if="toShow">
    <q-page>
      <q-row v-if="toShow" :class="'q-cols-' + columns" class="video-grid">
        <q-col
          v-for="(videoSrc, index) in allStreams"
          :key="`video-${index}`"
          :span="12 / columns"
          class="q-pa-md video-col"
        >
          <video :srcObject="videoSrc" class="video-item" autoplay></video>
        </q-col>
      </q-row>
      <q-alert v-else color="warning" icon="warning" :bordered="false">
        No videos available.
      </q-alert>

      <!-- Buttons for disabling mic, disabling webcam, and exiting the call -->
      <div class="controls">
        <q-btn @click="toggleMicrophone" :icon="microphoneIcon" label="Toggle Microphone" />
        <q-btn @click="toggleWebcam" :icon="webcamIcon" label="Toggle Webcam" />
        <q-btn @click="exitCall" icon="close" label="Exit Call" />
      </div>
    </q-page>
  </q-page-container>
</template>

<style scoped>
.video-grid {
  height: 100vh;
  overflow: hidden;
}

.video-col {
  height: 100%;
}

.video-item {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.controls {
  position: fixed;
  bottom: 20px;
  left: 20px;
}
</style>
