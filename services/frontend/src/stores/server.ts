import type { ChannelController } from '@/controllers/piperchat/channel/channel-controller'
import { ChannelControllerImpl } from '@/controllers/piperchat/channel/channel-controller-impl'
import type { ServerController } from '@/controllers/piperchat/server/server-controller'
import { ServerControllerImpl } from '@/controllers/piperchat/server/server-controller-impl'
import type { CreateChannelApi } from '@api/piperchat/channel'
import type { CreateServerApi, GetServersApi, KickUserFromServerApi } from '@api/piperchat/server'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useServerStore = defineStore('server', () => {
  const serverController: ServerController = new ServerControllerImpl()
  const channelController: ChannelController = new ChannelControllerImpl()

  const servers = ref<GetServersApi.Responses.Server[]>([])

  async function getServers() {
    const response = await serverController.getServers()
    if (response.statusCode === 200) {
      const typed = response as GetServersApi.Responses.Success
      servers.value = typed.servers
    }
  }

  async function createServer(name: string, description: string) {
    const response = await serverController.createServer({
      name,
      description
    })
    if (response.statusCode === 200) {
      getServers() // TODO: adjust using notification
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
      getServers() // TODO: adjust using notification
    } else {
      const typed = response as CreateChannelApi.Errors.Type
      throw new Error(String(typed.error))
    }
  }

  async function deleteChannel(serverId: string, channelId: string) {
    const response = await channelController.deleteChannel({ serverId, channelId })
    if (response.statusCode === 200) {
      servers.value = servers.value.map((server) => {
        if (server.id === serverId) {
          server.channels = server.channels.filter((channel) => channel.id !== channelId)
        }
        return server
      })
    } else {
      const typed = response as KickUserFromServerApi.Errors.Type
      throw new Error(String(typed.error))
    }
  }

  async function kickUser(serverId: string, username: string) {
    const response = await serverController.kickUserFromTheServer({ serverId, username })
    if (response.statusCode === 200) {
      servers.value = servers.value.map((server) => {
        if (server.id === serverId) {
          server.participants = server.participants.filter(
            (participant) => participant !== username
          )
        }
        return server
      })
    } else {
      const typed = response as KickUserFromServerApi.Errors.Type
      throw new Error(String(typed.error))
    }
  }

  return {
    getServers,
    createServer,
    createChannel,
    deleteChannel,
    kickUser,
    servers
  }
})
