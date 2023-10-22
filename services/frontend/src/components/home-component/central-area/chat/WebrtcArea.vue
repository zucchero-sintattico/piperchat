<script setup lang="ts">
import {
  SessionControllerImpl,
  type SessionController
} from '@/controllers/session/session-controller'
import { useUserStore, ContentArea } from '@/stores/user'
import { Cookies } from 'quasar'
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
const userStore = useUserStore()
const toShow = computed(() => userStore.inContentArea == ContentArea.Multimedia)

class StreamService {
  constraints: MediaStreamConstraints
  stream: Ref<MediaStream | undefined> = ref(undefined)
  mic_on = ref(false)
  cam_on = ref(false)

  constructor(constraints: MediaStreamConstraints) {
    this.constraints = constraints
    this.mic_on.value = (constraints.audio as boolean) || false
    this.cam_on.value = (constraints.video as boolean) || false
  }

  async start() {
    if (!this.stream.value) {
      this.stream.value = await navigator.mediaDevices.getUserMedia(this.constraints)
    }
  }

  async stop() {
    this.stream.value?.getTracks().forEach((track) => track.stop())
  }

  async toggleAudio() {
    this.stream?.value?.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
    this.mic_on.value = !this.mic_on.value
  }

  async toggleVideo() {
    this.stream?.value?.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
    this.cam_on.value = !this.cam_on.value
  }
}

let streamService: StreamService = new StreamService({
  video: true,
  audio: true
})

const otherStreams = ref<Record<string, MediaStream>>({})

const allVideos = computed(() => {
  let videos = otherStreams.value
  if (streamService.stream.value) videos[userStore.username] = streamService.stream.value
  return videos
})

let columns = computed(() => Math.min(2, Object.keys(otherStreams.value).length + 1))

watch(toShow, async (inWebrtc) => {
  if (inWebrtc) {
    console.log('getting stream')
    const jwtToken = userStore.jwt
    const sessionController: SessionController = new SessionControllerImpl(jwtToken || '')
    const sessionHandler = await sessionController.joinChannel(
      userStore.selectedServerId,
      userStore.selectedChannel[1]
    )
    await streamService.start()
    sessionHandler.start(
      streamService.stream.value!,
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
    streamService.stop()
  }
})

function toggleMicrophone() {
  streamService.toggleAudio()
}

function toggleWebcam() {
  streamService.toggleVideo()
}

function exitCall() {
  streamService.stop()
}

const microphoneIcon = computed(() => {
  if (streamService.mic_on.value) {
    return 'mic'
  } else {
    return 'mic_off'
  }
})

const webcamIcon = computed(() => {
  if (streamService.cam_on.value) {
    return 'videocam'
  } else {
    return 'videocam_off'
  }
})
</script>

<template>
  <q-page-container padding v-if="toShow">
    <q-page>
      <div class="q-pa-md">
        <div v-if="toShow" class="video-grid">
          <div
            v-for="(videoSrc, username) in allVideos"
            :key="`video-${username}`"
            class="video-col q-pa-md"
            :style="{ width: `${100 / columns}%` }"
          >
            <div class="video-wrapper">
              <div class="overlay">{{ username }}</div>
              <video
                v-if="username != userStore.username"
                :srcObject="videoSrc"
                autoplay
                class="video-item"
              ></video>
              <video v-else :srcObject="videoSrc" autoplay muted class="video-item"></video>
            </div>
          </div>
        </div>
      </div>
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
  display: flex;
  flex-wrap: wrap;
}

.video-col {
  box-sizing: border-box;
  height: 200px; /* Set a fixed height for the video columns */
}

.video-wrapper {
  position: relative;
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
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  z-index: 100;
}

.controls > * {
  min-width: 50px;
  min-height: 50px;
  background-color: white;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 8px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
