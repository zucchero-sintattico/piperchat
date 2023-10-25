<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { useWebRTCStore } from '@/stores/webrtc'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const userStore = useUserStore()
const webrtcStore = useWebRTCStore()

async function join() {
  if (appStore.inDirectCall) {
    await webrtcStore.joinDirect(appStore.selectedDirect!)
  } else {
    await webrtcStore.joinChannel(appStore.selectedServer!.id, appStore.selectedChannel!.id)
  }
}

const columns = computed(() => Math.min(2, Object.keys(webrtcStore.otherStream).length + 1))
</script>

<template>
  <q-page-container padding>
    <q-page v-if="webrtcStore.joined">
      <div class="q-pa-md">
        <div class="video-grid">
          <div
            :key="`video-${userStore.username}`"
            class="video-col q-pa-md"
            :style="{ width: `${100 / columns}%` }"
          >
            <div class="video-wrapper">
              <div class="overlay">
                <div class="username">{{ userStore.username }}</div>
              </div>
              <video :srcObject="webrtcStore.myStream" autoplay muted class="video-item"></video>
            </div>
          </div>
          <div
            v-for="(videoSrc, username) in webrtcStore.otherStream"
            :key="`video-${username}`"
            class="video-col q-pa-md"
            :style="{ width: `${100 / columns}%` }"
          >
            <div class="video-wrapper">
              <div class="overlay">
                <div class="username">{{ username }}</div>
              </div>
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
        <q-btn @click="webrtcStore.stop" icon="close" label="Exit Call" />
      </div>
    </q-page>
    <q-page v-if="!webrtcStore.joined">
      <div class="join-button-wrapper">
        <q-btn @click="join" label="Join Call" class="join-button" />
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
  height: 100%;
}

.video-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.video-col {
  box-sizing: border-box;
  flex: 1 0 calc(25% - 16px); /* Adjust width and gap as needed */
}

.video-wrapper {
  position: relative;
  height: 100%;
}

.video-item {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  object-fit: cover;
  border-radius: 10px;
}

.controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  z-index: 100;
}

.controls > * {
  min-width: 50px;
  min-height: 50px;
  background-color: white;
  border-radius: 10px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0); /* Adjust transparency */
  padding: 8px;
}

.username {
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.5); /* Adjust transparency */
  width: 100%;
  padding: 4px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 10px;
}

.join-button-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
