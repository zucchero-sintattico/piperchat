import type {
  FriendRequestAcceptedNotification,
  FriendRequestNotification,
  NewMessageOnChannelNotification,
  NewMessageOnDirectNotification,
  UserOfflineNotification,
  UserOnlineNotification
} from '@api/notifications/messages'
import { useUserStore } from '@/stores/user'
import { io } from 'socket.io-client'

class NotificationService {
  callbacks: { [key: string]: Function } = {}

  on(type: string, callback: Function) {
    this.callbacks[type] = callback
  }
}

// Need to defer this function in order to avoid pinia errors
function createNotificationService() {
  const notificationService = new NotificationService()

  const userStore = useUserStore()

  notificationService.on('new-direct-message', (data: NewMessageOnDirectNotification) => {
    console.log(data)
  })

  notificationService.on('new-channel-message', (data: NewMessageOnChannelNotification) => {
    console.log(data)
  })

  notificationService.on('friend-request', (data: FriendRequestNotification) => {
    console.log(data)
  })

  notificationService.on('friend-request-accepted', (data: FriendRequestAcceptedNotification) => {
    console.log(data)
  })

  notificationService.on('user-online', (data: UserOnlineNotification) => {
    console.log(data)
  })

  notificationService.on('user-offline', (data: UserOfflineNotification) => {
    console.log(data)
  })

  return notificationService
}

export function useNotificationService() {
  const notificationService = createNotificationService()
  const notificationSocket = io({
    transports: ['websocket'],
    path: '/notification'
  })

  notificationSocket.on('notification', (data: any) => {
    notificationService.callbacks[data.type](data)
  })
}
