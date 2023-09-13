import type { ServerController } from '@/controllers/piperchat/server/server-controller'
import { ServerControllerImpl } from '@/controllers/piperchat/server/server-controller-impl'
import type { GetServersApi } from '@api/piperchat/server'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'server',
  () => {
    const serverController: ServerController = new ServerControllerImpl()

    const servers = ref<GetServersApi.Responses.Server[]>([])

    async function getServers() {
      const response = await serverController.getServers()

      if (response.statusCode === 200) {
        const typed = response as GetServersApi.Responses.Success
        servers.value = typed.servers
      }
    }

    return {
      getServers
    }
  },
  { persist: true }
)
