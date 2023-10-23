import {
  FriendRequestAcceptedNotification,
  FriendRequestNotification,
  NewMessageOnChannelNotification,
  NewMessageOnDirectNotification,
  ServerDeletedNotification,
  UserJoinedServerNotification,
  UserLeftServerNotification,
  UserOfflineNotification,
  UserOnlineNotification
} from '@api/notifications/messages'
import { useUserStore } from '@/stores/user'
import { io } from 'socket.io-client'
import { useWebRTCStore } from '@/stores/webrtc'
import { useServerStore } from '@/stores/server'
import { useMessageStore } from '@/stores/messages'

class NotificationService {
  callbacks: { [key: string]: Function } = {}

  on<T>(messageClass: { type: string }, callback: (message: T) => void) {
    this.callbacks[messageClass.type] = callback
  }
}

// Need to defer this function in order to avoid pinia errors
function createNotificationService() {
  const notificationService = new NotificationService()

  const userStore = useUserStore()
  const messageStore = useMessageStore()
  const serverStore = useServerStore()
  const webRtcStore = useWebRTCStore()

  notificationService.on(
    NewMessageOnDirectNotification.prototype,
    async (data: NewMessageOnDirectNotification) => {
      console.log(data)
      if (userStore.selectedDirect === data.from) {
        // TODO: Reload messages
      }
    }
  )

  notificationService.on(
    NewMessageOnChannelNotification.prototype,
    (data: NewMessageOnChannelNotification) => {
      console.log(data)
      // TODO: Reload messages
    }
  )

  notificationService.on(FriendRequestNotification.prototype, (data: FriendRequestNotification) => {
    console.log(data)
    // TODO: Popup and notification over the friends icon
  })

  notificationService.on(
    FriendRequestAcceptedNotification.prototype,
    (data: FriendRequestAcceptedNotification) => {
      console.log(data)
      // TODO: Popup
    }
  )

  notificationService.on(UserOnlineNotification.prototype, (data: UserOnlineNotification) => {
    console.log(data)
    // TODO: Refresh users list
  })

  notificationService.on(UserOfflineNotification.prototype, (data: UserOfflineNotification) => {
    console.log(data)
    // TODO: Refresh users list
  })

  notificationService.on(ServerDeletedNotification.prototype, () => {
    serverStore.refreshUserServers()
  })

  notificationService.on(UserJoinedServerNotification.prototype, (data) => {
    serverStore.refreshUserServers()
  })

  notificationService.on(UserLeftServerNotification.prototype, (data) => {
    serverStore.refreshUserServers()
  })

  return notificationService
}

export function useNotificationService() {
  const notificationService = createNotificationService()
  const notificationSocket = io({
    transports: ['websocket'],
    path: '/notification'
  })

  notificationSocket.on('connect', () => {
    console.log('Connected to notification service')
  })

  notificationSocket.on('notification', (data: any) => {
    notificationService.callbacks[data.type]?.(data)
  })
}
