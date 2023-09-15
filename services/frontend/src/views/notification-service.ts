import type {
  FriendRequestAcceptedNotification,
  FriendRequestNotification,
  NewMessageOnChannelNotification,
  NewMessageOnDirectNotification,
  UserOfflineNotification,
  UserOnlineNotification
} from '@api/notifications/messages'
import { useUserStore } from '@/stores/user'

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
  const ev = new EventSource('/notification')

  ev.addEventListener('message', (e) => {
    try {
      const data = JSON.parse(e.data)
      console.log(data)
      notificationService.callbacks[data.type](data)
    } catch (e) {
      console.log(e)
    }
  })
}
