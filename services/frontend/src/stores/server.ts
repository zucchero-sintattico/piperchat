import type { ChannelController } from '@/controllers/piperchat/channel/channel-controller'
import { ChannelControllerImpl } from '@/controllers/piperchat/channel/channel-controller-impl'
import type { ServerController } from '@/controllers/piperchat/server/server-controller'
import { ServerControllerImpl } from '@/controllers/piperchat/server/server-controller-impl'
import type { CreateChannelApi } from '@api/piperchat/channel'
import type { GetServersApi } from '@api/piperchat/server'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useServerStore = defineStore('server', () => {
  const serverController: ServerController = new ServerControllerImpl()
  const channelController: ChannelController = new ChannelControllerImpl()

  const servers = reactive<GetServersApi.Responses.Server[]>([])

  async function getServers() {
    const response = await serverController.getServers()

    if (response.statusCode === 200) {
      const typed = response as GetServersApi.Responses.Success
      servers.splice(0, servers.length, ...typed.servers)
    }
  }

  async function createServer(name: string, description: string) {
    try {
      const response = await serverController.createServer({
        name,
        description
      })
      if (response.statusCode === 200) {
        getServers()
      } else {
        console.log(response)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function createChannel(
    name: string,
    description: string,
    channelType: CreateChannelApi.ChannelType,
    serverId: string
  ) {
    try {
      const response = await channelController.createChannel({
        name,
        channelType,
        description,
        serverId
      })
      if (response.statusCode === 200) {
        getServers()
      } else {
        console.log(response)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return {
    getServers,
    createServer,
    createChannel,
    servers
  }
})
