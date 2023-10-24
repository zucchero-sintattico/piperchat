import {
  SessionControllerImpl,
  type SessionController
} from '@/controllers/session/session-controller'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useUserStore } from './user'
import type { SessionHandler } from '@/controllers/session/session-handler'
import { StreamService } from './utils/stream-service'

export const useWebRTCStore = defineStore('webrtc', () => {
  const userStore = useUserStore()
  const streamService: StreamService = new StreamService({
    audio: true,
    video: true
  })
  const myStream = streamService.stream
  const otherStream: Ref<Record<string, MediaStream>> = ref({})

  const sessionController: SessionController = new SessionControllerImpl(userStore.jwt)
  const sessionHandler: Ref<SessionHandler | null> = ref(null)
  const joined = computed(() => sessionHandler.value !== null)
  async function start() {
    console.log('Starting session')
    otherStream.value = {}
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

  async function getUsersInMediaChannel(serverId: string, channelId: string) {
    const sessionId = await sessionController.getChannelSessionId(serverId, channelId)
    return await sessionController.getUsersInSession(sessionId)
  }

  return {
    myStream,
    otherStream,
    joined,
    joinChannel,
    joinDirect,
    stop,
    toggleAudio,
    toggleVideo,
    mic_on,
    cam_on,
    getUsersInMediaChannel
  }
})
