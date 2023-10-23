<script setup lang="ts">
import { useUserStore, ContentArea } from '@/stores/user'
import { computed, ref } from 'vue'
import { useWebRTCStore } from '@/stores/webrtc'

const userStore = useUserStore()
const webrtcStore = useWebRTCStore()

const toShow = computed(() => userStore.inContentArea == ContentArea.Multimedia)

const joined = ref(false)

async function join() {
  await webrtcStore.joinChannel(userStore.selectedServerId, userStore.selectedChannelId)
  joined.value = true
}

async function stop() {
  webrtcStore.stop()
  joined.value = false
}

const columns = computed(() => Math.min(2, Object.keys(webrtcStore.otherStream.value).length + 1))
</script>

<template>
  <q-page-container padding v-if="toShow">
    <q-page v-if="joined">
      <div class="q-pa-md">
        <div class="video-grid">
          <div class="video-wrapper" v-if="webrtcStore.myStream">
            <div class="overlay">{{ userStore.username }}</div>
            <video :srcObject="webrtcStore.myStream" autoplay muted class="video-item"></video>
          </div>
          <div
            v-for="(videoSrc, username) in webrtcStore.otherStream"
            :key="`video-${username}`"
            class="video-col q-pa-md"
            :style="{ width: `${100 / columns}%` }"
          >
            <div class="video-wrapper">
              <div class="overlay">{{ username }}</div>
              <video :srcObject="videoSrc" autoplay class="video-item"></video>
            </div>
          </div>
        </div>
      </div>
      <!-- Buttons for disabling mic, disabling webcam, and exiting the call -->
      <div class="controls">
        <q-btn
          @click="webrtcStore.toggleAudio"
          :icon="webrtcStore.mic_on ? 'mic' : 'mic_off'"
          label="Toggle Microphone"
        />
        <q-btn
          @click="webrtcStore.toggleVideo"
          :icon="webrtcStore.cam_on ? 'videocam' : 'videocam_off'"
          label="Toggle Webcam"
        />
        <q-btn @click="stop" icon="close" label="Exit Call" />
      </div>
    </q-page>
    <q-page v-if="!joined">
      <q-btn @click="join" label="Join Call" class="join-button" />
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

.join-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
