import {
  SessionControllerImpl,
  type SessionController
} from '@/controllers/session/session-controller'
import { defineStore } from 'pinia'
import { computed, ref, watch, type Ref } from 'vue'
import { useUserStore } from './user'
import type { SessionHandler } from '@/controllers/session/session-handler'
import { StreamService } from './utils/stream-service'
import { useAppStore } from './app'

interface UserWithPhoto {
  username: string
  photo: string
}

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

  const userInMediaChannels = ref<Record<string, UserWithPhoto[]>>({})

  /*   const refreshing = ref(false)
  async function refreshUserInMultimediaChannels() {
    if (refreshing.value) return
    refreshing.value = true
    userInMediaChannels.value = {}
    for (const channel of appStore.selectedServer?.channels.filter(
      (channel) => channel.channelType == 'multimedia'
    ) ?? []) {
      try {
        const sessionId = await sessionController.getChannelSessionId(
          appStore.selectedServer!.id,
          channel.id
        )
        const usernames = await sessionController.getUsersInSession(sessionId)
        const usersWithPhoto: UserWithPhoto[] = []
        for (const username of usernames) {
          const photo = (await userStore.getUserPhoto(username))!
          usersWithPhoto.push({
            username,
            photo
          })
        }
        userInMediaChannels.value[channel.id] = usersWithPhoto
      } catch (e) {
        continue
      }
    }
    refreshing.value = false
  }

  watch(
    () => appStore.selectedServer,
    async (server) => {
      if (server === null) return
      console.log('Refreshing users in multimedia channels')
      await refreshUserInMultimediaChannels()
    }
  ) */

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
    userInMediaChannels
    // refreshUserInMultimediaChannels
  }
})
