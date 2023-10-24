import { defineStore } from 'pinia'
import { computed, ref, watch, type Ref } from 'vue'
import type { ChannelController } from '@/controllers/messages/channel/channel-controller'
import { ChannelControllerImpl } from '@/controllers/messages/channel/channel-controller-impl'
import type { DirectController } from '@/controllers/messages/direct/direct-controller'
import { DirectControllerImpl } from '@/controllers/messages/direct/direct-controller-impl'
import { GetDirectMessagesApi, SendDirectMessageApi } from '@api/messages/direct'
import { ContentArea, useUserStore } from './user'
import type { SendMessageInChannelApi } from '@api/messages/channel'
import { useAppStore } from './app'
import { useServerStore } from './server'

export const useMessageStore = defineStore('message', () => {
  const userStore = useUserStore()
  const appStore = useAppStore()
  const serverStore = useServerStore()

  // array of message
  const currentSection: Ref<ContentArea.Channel | ContentArea.Direct | undefined> = computed(() => {
    if (appStore.selectedChannel !== null && appStore.selectedChannel.channelType !== 'multimedia')
      return ContentArea.Channel
    if (appStore.selectedDirect !== null) return ContentArea.Direct
    return undefined
  })

  const currentSectionInfo = computed(() => {
    if (currentSection.value == ContentArea.Channel) {
      return {
        serverId: appStore.selectedServer!.id,
        channelId: appStore.selectedChannel!.id
      }
    } else if (currentSection.value == ContentArea.Direct) {
      return {
        username: appStore.selectedDirect!
      }
    } else {
      return undefined
    }
  })

  const messages = ref<GetDirectMessagesApi.Responses.Message[]>([])
  watch(currentSectionInfo, async (info) => {
    if (info == undefined) return
    messages.value = []
    resetMessagesNumber()
    await refreshMessages()
  })

  const messagesLoaded = computed(() => messages.value.length > 0)
  const loadingNewMessages = ref(false)

  const messagesNumberLimit = 30
  const messagesNumber = ref(messagesNumberLimit)
  function resetMessagesNumber() {
    messagesNumber.value = messagesNumberLimit
  }
  function increaseMessagesNumber() {
    messagesNumber.value += messagesNumberLimit
  }

  const usersPhotos = ref(new Map<string, string>())

  async function fetchUsersPhotos() {
    // If the user is in a direct, fetch the photo of the other user
    if (currentSection.value == ContentArea.Direct) {
      const info = currentSectionInfo.value as { username: string }
      if (!usersPhotos.value.has(info.username)) {
        const photo = await userStore.getUserPhoto(info.username)
        usersPhotos.value.set(info.username, photo?.toString() || '')
      }
    }
    // If the user is in a channel, fetch the photos of all the partecipants of the server
    if (currentSection.value == ContentArea.Channel) {
      const info = currentSectionInfo.value as { serverId: string }
      for (const user of await serverStore.getServerParticipants(info.serverId)) {
        if (!usersPhotos.value.has(user)) {
          const photo = await userStore.getUserPhoto(user)
          usersPhotos.value.set(user, photo?.toString() || '')
        }
      }
    }
  }

  const channelController: ChannelController = new ChannelControllerImpl()
  const directController: DirectController = new DirectControllerImpl()

  async function sendMessage(
    content: string,
    onSuccess: () => void = () => {},
    onError: (error: any) => void = () => {}
  ) {
    try {
      let response: SendMessageInChannelApi.Response | SendDirectMessageApi.Response
      if (currentSection.value == ContentArea.Channel) {
        const info = currentSectionInfo.value as { serverId: string; channelId: string }
        response = await channelController.sendMessage({
          content: content,
          serverId: info.serverId,
          channelId: info.channelId
        })
      } else {
        const info = currentSectionInfo.value as { username: string }
        response = await directController.sendDirectMessage({
          message: content,
          username: info.username
        })
      }
      switch (response.statusCode) {
        case 200:
          await refreshMessages()
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

  async function refreshMessages() {
    if (currentSection.value === ContentArea.Channel) {
      const info = currentSectionInfo.value as { serverId: string; channelId: string }
      await refreshMessagesFromChannel({
        serverId: info.serverId,
        channelId: info.channelId,
        from: 0,
        limit: messagesNumber.value
      })
    } else {
      const info = currentSectionInfo.value as { username: string }
      await refreshMessagesFromDirect({
        username: info.username,
        from: 0,
        limit: messagesNumber.value
      })
    }
    await fetchUsersPhotos()
  }

  async function loadNewMessages() {
    if (loadingNewMessages.value) return
    loadingNewMessages.value = true
    if (currentSection.value === ContentArea.Channel) {
      const info = currentSectionInfo.value as { serverId: string; channelId: string }
      await refreshMessagesFromChannel(
        {
          serverId: info.serverId,
          channelId: info.channelId,
          from: messagesNumber.value,
          limit: messagesNumberLimit
        },
        true
      )
    } else {
      const info = currentSectionInfo.value as { username: string }
      await refreshMessagesFromDirect(
        {
          username: info.username,
          from: messagesNumber.value,
          limit: messagesNumberLimit
        },
        true
      )
    }
    increaseMessagesNumber()
    loadingNewMessages.value = false
  }

  async function refreshMessagesFromDirect(
    {
      username,
      from,
      limit
    }: {
      username: string
      from: number
      limit: number
    },
    concat: boolean = false
  ) {
    const response = await directController.getDirectMessagesPaginated({
      username,
      from,
      limit
    })
    switch (response.statusCode) {
      case 200: {
        const typedResponse = response as GetDirectMessagesApi.Responses.Success
        console.log('Updating messages')
        if (concat) {
          if (typedResponse.messages.length === 0) {
            console.log('No more messages')
          } else {
            console.log('Loaded new messages', typedResponse.messages)
            messages.value = typedResponse.messages.concat(messages.value)
          }
        } else {
          console.log('Setting messages to', typedResponse.messages)
          messages.value = typedResponse.messages
        }
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

  async function refreshMessagesFromChannel(
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
          if (typedResponse.messages.length === 0) {
            console.log('No more messages')
          } else {
            console.log('Loaded new messages', typedResponse.messages)
            messages.value = typedResponse.messages.concat(messages.value)
          }
        } else {
          console.log('Setting messages to', typedResponse.messages)
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
    currentSection,
    currentSectionInfo,

    usersPhotos,
    messages,
    messagesLoaded,
    sendMessage,

    messagesNumber,
    increaseMessagesNumber,
    resetMessagesNumber,
    loadNewMessages,
    loadingNewMessages,

    refreshMessages
  }
})
