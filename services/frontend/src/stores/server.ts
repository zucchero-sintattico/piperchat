import type { ChannelController } from '@/controllers/piperchat/channel/channel-controller'
import { ChannelControllerImpl } from '@/controllers/piperchat/channel/channel-controller-impl'
import type { ServerController } from '@/controllers/piperchat/server/server-controller'
import { ServerControllerImpl } from '@/controllers/piperchat/server/server-controller-impl'
import type { CreateChannelApi, GetChannelByIdApi } from '@api/piperchat/channel'
import type {
  CreateServerApi,
  GetServerParticipantsApi,
  GetServersApi,
  JoinServerApi,
  KickUserFromServerApi,
  UpdateServerApi
} from '@api/piperchat/server'
import { defineStore } from 'pinia'
import { computed, ref, watch, type Ref } from 'vue'
import { useUserStore } from './user'
import { useAppStore } from './app'
import { useWebRTCStore } from './webrtc'

type Server = GetServersApi.Responses.Server
type Channel = GetChannelByIdApi.Responses.Channel

interface UserWithPhoto {
  username: string
  photo: string
}
export const useServerStore = defineStore('server', () => {
  const appStore = useAppStore()
  const webrtcStore = useWebRTCStore()
  const userStore = useUserStore()
  const serverController: ServerController = new ServerControllerImpl()
  const channelController: ChannelController = new ChannelControllerImpl()

  const servers = ref<Server[]>([])

  const amITheOwner = computed(() => {
    if (appStore.selectedServer === null) return false
    return appStore.selectedServer.owner === userStore.username
  })

  const mediaChannelParticipants: Ref<Record<string, UserWithPhoto[]>> = ref({})
  watch(
    () => appStore.selectedServer,
    async (server) => {
      server?.channels
        .filter((channel) => channel.channelType === 'multimedia')
        .forEach(async (channel) => {
          const users = await webrtcStore.getUsersInMediaChannel(server.id, channel.id)
          const usersWithPhoto: UserWithPhoto[] = []
          for (const username of users) {
            const photo = (await userStore.getUserPhoto(username))!
            usersWithPhoto.push({ username, photo })
          }
          mediaChannelParticipants.value[channel.id] = usersWithPhoto
        })
    }
  )

  async function refreshUserServers() {
    const response = await serverController.getServers()
    if (response.statusCode === 200) {
      const typed = response as GetServersApi.Responses.Success
      servers.value = typed.servers
    }
    const selectedServer = appStore.selectedServer
    if (selectedServer !== null) {
      const server = servers.value.find((server) => server.id === selectedServer.id)
      if (server === undefined) {
        appStore.setDirects()
      } else {
        appStore.selectServer(server)
      }
      if (appStore.selectedChannel !== null) {
        const channel = server?.channels.find(
          (channel) => channel.id === appStore.selectedChannel?.id
        )
        if (channel === undefined) {
          appStore.setDirects()
        } else {
          appStore.selectChannel(channel)
        }
      }
    }
  }

  async function createServer(name: string, description: string) {
    const response = await serverController.createServer({
      name,
      description
    })
    if (response.statusCode === 200) {
      await refreshUserServers()
    } else {
      const typed = response as CreateServerApi.Errors.Type
      throw new Error(String(typed.error))
    }
  }

  async function createChannel(
    name: string,
    description: string,
    channelType: CreateChannelApi.ChannelType,
    serverId: string
  ) {
    const response = await channelController.createChannel({
      name,
      channelType,
      description,
      serverId
    })
    if (response.statusCode === 200) {
      await refreshUserServers()
    } else {
      const typed = response as CreateChannelApi.Errors.Type
      throw new Error(String(typed.error))
    }
  }

  async function joinServer(serverId: string) {
    const response = await serverController.joinServer({ serverId })
    if (response.statusCode === 200) {
      await refreshUserServers()
    } else {
      const typed = response as JoinServerApi.Errors.Type
      throw new Error(String(typed.error))
    }
  }

  async function leaveServer(serverId: string) {
    const response = await serverController.leaveServer({ serverId })
    if (response.statusCode === 200) {
      await refreshUserServers()
    } else {
      const typed = response as JoinServerApi.Errors.Type
      throw new Error(String(typed.error))
    }
  }

  async function deleteChannel(serverId: string, channelId: string) {
    const response = await channelController.deleteChannel({ serverId, channelId })
    if (response.statusCode === 200) {
      await refreshUserServers()
    } else {
      const typed = response as KickUserFromServerApi.Errors.Type
      throw new Error(String(typed.error))
    }
  }

  async function kickUser(serverId: string, username: string) {
    const response = await serverController.kickUserFromTheServer({ serverId, username })
    if (response.statusCode === 200) {
      await refreshUserServers()
    } else {
      const typed = response as KickUserFromServerApi.Errors.Type
      throw new Error(String(typed.error))
    }
  }

  async function getServerParticipants(serverId: string) {
    return servers.value.find((server) => server.id === serverId)?.participants ?? []
  }

  async function updateServer(serverId: string, name?: string, description?: string) {
    const response = await serverController.updateServer({
      serverId,
      name: name,
      description: description
    })
    if (response.statusCode === 200) {
      await refreshUserServers()
    } else {
      const typed = response as UpdateServerApi.Errors.Type
      throw new Error(String(typed.error))
    }
  }

  async function updateChannel(
    serverId: string,
    channelId: string,
    name?: string,
    description?: string
  ) {
    const response = await channelController.updateChannel({
      serverId,
      channelId,
      name: name,
      description: description
    })
    if (response.statusCode === 200) {
      await refreshUserServers()
    } else {
      const typed = response as UpdateServerApi.Errors.Type
      throw new Error(String(typed.error))
    }
  }

  return {
    refreshUserServers,
    createServer,
    createChannel,
    deleteChannel,
    kickUser,
    joinServer,
    leaveServer,
    updateServer,
    getServerParticipants,
    updateChannel,
    amITheOwner,
    servers,
    mediaChannelParticipants
  }
})
