import {
  SessionControllerImpl,
  type SessionController
} from '@/controllers/session/session-controller'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useUserStore } from './user'
import type { SessionHandler } from '@/controllers/session/session-handler'

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

export const useWebRTCStore = defineStore(
  'webrtc',
  () => {
    const userStore = useUserStore()
    const streamService: StreamService = new StreamService({
      audio: true,
      video: true
    })
    const myStream = streamService.stream
    const otherStream = ref<Record<string, MediaStream>>({})

    const sessionController: SessionController = new SessionControllerImpl(userStore.jwt)
    const sessionHandler: Ref<SessionHandler | null> = ref(null)

    async function start() {
      await streamService.start()
      sessionHandler.value!.start(
        myStream.value!,
        (username, stream) => {
          otherStream.value[username] = stream
        },
        (username) => {
          delete otherStream.value[username]
        }
      )
    }

    async function joinChannel(serverId: string, channelId: string) {
      if (sessionHandler.value) {
        await stop()
      }
      sessionHandler.value = await sessionController.joinChannel(serverId, channelId)
      await start()
    }

    async function joinDirect(username: string) {
      if (sessionHandler.value) {
        await stop()
      }
      sessionHandler.value = await sessionController.joinDirectSession(username)
      await start()
    }

    async function toggleAudio() {
      await streamService.toggleAudio()
    }

    async function toggleVideo() {
      await streamService.toggleVideo()
    }

    async function stop() {
      sessionHandler.value?.stop()
      sessionHandler.value = null
      await streamService.stop()
    }

    const mic_on = streamService.mic_on
    const cam_on = streamService.cam_on
    return {
      myStream,
      otherStream,
      joinChannel,
      joinDirect,
      stop,
      toggleAudio,
      toggleVideo,
      mic_on,
      cam_on
    }
  },
  {
    persist: true
  }
)
