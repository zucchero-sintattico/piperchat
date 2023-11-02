import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

type ChannelMessage = {
  sender: string
  channelName: string
}

type DirectMessage = {
  sender: string
}

export const useNotificationStore = defineStore('notification', () => {
  const newFriendRequests: Ref<string[]> = ref([])
  const newFriendRequestsAccepted: Ref<string[]> = ref([])
  const newMessagesOnChannel: Ref<ChannelMessage[]> = ref([])
  const newMessagesOnDirect: Ref<DirectMessage[]> = ref([])

  function addFriendRequest(username: string) {
    console.log('[NotificationStore] Adding friend request', username)
    newFriendRequests.value.push(username)
  }

  function addMessageOnChannel(message: ChannelMessage) {
    console.log('[NotificationStore] Adding message on channel', message)
    newMessagesOnChannel.value.push(message)
  }

  function addMessageOnDirect(message: DirectMessage) {
    console.log('[NotificationStore] Adding message on direct', message)
    newMessagesOnDirect.value.push(message)
  }

  function addFriendRequestAccepted(username: string) {
    console.log('[NotificationStore] Adding friend request accepted', username)
    newFriendRequestsAccepted.value.push(username)
  }

  return {
    newFriendRequests,
    newMessagesOnChannel,
    newMessagesOnDirect,
    newFriendRequestsAccepted,

    addFriendRequest,
    addMessageOnChannel,
    addMessageOnDirect,
    addFriendRequestAccepted
  }
})
