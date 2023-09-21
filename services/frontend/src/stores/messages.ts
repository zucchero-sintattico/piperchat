import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChannelController } from '@/controllers/messages/channel/channel-controller'
import { ChannelControllerImpl } from '@/controllers/messages/channel/channel-controller-impl'
import type { DirectController } from '@/controllers/messages/direct/direct-controller'
import { DirectControllerImpl } from '@/controllers/messages/direct/direct-controller-impl'
import { GetDirectMessagesApi } from '@api/messages/direct'

export const useMessageStore = defineStore('message', () => {
  // array of message
  const messages = ref<GetDirectMessagesApi.Responses.Message[]>([])

  const channelController: ChannelController = new ChannelControllerImpl()
  const directController: DirectController = new DirectControllerImpl()

  async function sendMessageOnChannel(
    parameters: { content: string; serverId: string; channelId: string },
    onSuccess: () => void,
    onError: (error: any) => void
  ) {
    try {
      const response = await channelController.sendMessage({
        content: parameters.content,
        serverId: parameters.serverId,
        channelId: parameters.channelId
      })
      switch (response.statusCode) {
        case 200:
          onSuccess()
          break
        case 403:
          onError("You don't have permission to access this resource")
          break
        case 404:
          onError('Channel not found')
          break
        default:
          onError('Error')
          break
      }
    } catch (e) {
      onError(e)
    }
  }

  async function sendMessageOnDirect(
    parameters: { content: string; username: string },
    onSuccess: () => void,
    onError: (error: any) => void
  ) {
    try {
      const response = await directController.sendDirectMessage({
        message: parameters.content,
        username: parameters.username
      })
      switch (response.statusCode) {
        case 200:
          onSuccess()
          break
        case 403:
          onError("You don't have permission to access this resource")
          break
        case 404:
          onError('User not found')
          break
        default:
          onError('Error')
          break
      }
    } catch (e) {
      onError(e)
    }
  }

  async function getMessagesFromDirect({
    username,
    from,
    limit
  }: {
    username: string
    from: number
    limit: number
  }) {
    const response = await directController.getDirectMessagesPaginated({
      username,
      from,
      limit
    })
    switch (response.statusCode) {
      case 200: {
        const typedResponse = response as GetDirectMessagesApi.Responses.Success
        messages.value = typedResponse.messages
        break
      }
      case 403:
        throw new Error("You don't have permission to access this resource")
      case 404:
        throw new Error('User not found')
      default:
        throw new Error('Error')
    }
  }

  async function getMessagesFromChannel(
    parameters: {
      serverId: string
      channelId: string
      from: number
      limit: number
    },
    concat: boolean = false
  ) {
    console.log('Getting messages')
    const response = await channelController.getChannelMessagesPaginated({
      serverId: parameters.serverId,
      channelId: parameters.channelId,
      from: parameters.from,
      limit: parameters.limit
    })
    switch (response.statusCode) {
      case 200: {
        const typedResponse = response as GetDirectMessagesApi.Responses.Success
        console.log('Updating messages')
        if (concat) {
          messages.value = typedResponse.messages.concat(messages.value)
          if (typedResponse.messages.length === 0) {
            console.log('No more messages')
            return
          }
        } else {
          messages.value = typedResponse.messages
        }

        break
      }
      case 403:
        throw new Error("You don't have permission to access this resource")

      case 404:
        throw new Error('Channel not found')

      default:
        throw new Error('Error')
    }
  }

  return {
    messages,
    sendMessageOnChannel,
    sendMessageOnDirect,
    getMessagesFromChannel,
    getMessagesFromDirect
  }
})
