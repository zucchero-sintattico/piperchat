import {
  ChannelCreatedNotification,
  ChannelDeletedNotification,
  ChannelUpdatedNotification,
  FriendRequestAcceptedNotification,
  FriendRequestNotification,
  NewMessageOnChannelNotification,
  NewMessageOnDirectNotification,
  ServerDeletedNotification,
  ServerUpdatedNotification,
  UserJoinedServerNotification,
  UserLeftServerNotification,
  UserOfflineNotification,
  UserOnlineNotification
} from '@api/notifications/messages'
import { io } from 'socket.io-client'
import { useServerStore } from '@/stores/server'
import { useMessageStore } from '@/stores/messages'
import { useAppStore } from '@/stores/app'
import { useFriendStore } from '@/stores/friend'
import { useNotificationStore } from '@/stores/notifications'

class NotificationService {
  callbacks: Record<string, (message: any) => Promise<void>> = {}

  on(type: string, callback: (message: any) => Promise<void>) {
    this.callbacks[type] = callback
  }
}
// Need to defer this function in order to avoid pinia errors
function createNotificationService() {
  const notificationService = new NotificationService()

  const appStore = useAppStore()
  const friendsStore = useFriendStore()
  const messageStore = useMessageStore()
  const serverStore = useServerStore()
  const notificationsStore = useNotificationStore()

  function setupMessagesListeners() {
    notificationService.on(
      NewMessageOnDirectNotification.type,
      async (data: NewMessageOnDirectNotification) => {
        console.log('NotificationService: NewMessageOnDirectNotification', data)
        notificationsStore.addMessageOnDirect({
          sender: data.from
        })
        if (appStore.selectedDirect == data.from) {
          console.log('NotificationService: Refreshing messages')
          await messageStore.refreshMessages()
        }
      }
    )

    notificationService.on(
      NewMessageOnChannelNotification.type,
      async (data: NewMessageOnChannelNotification) => {
        console.log('NotificationService: NewMessageOnChannelNotification', data)
        const channelName = serverStore.servers
          .find((s) => s.id == data.server)
          ?.channels.find((c) => c.id == data.channel)?.name
        notificationsStore.addMessageOnChannel({
          sender: data.from,
          channelName: channelName ?? ''
        })
        if (
          appStore.selectedServer?.id == data.server &&
          appStore.selectedChannel?.id == data.channel
        ) {
          console.log('NotificationService: Refreshing messages')
          await messageStore.refreshMessages()
        }
      }
    )
  }

  function setupServersListeners() {
    notificationService.on(
      ServerDeletedNotification.type,
      async (data: ServerDeletedNotification) => {
        console.log('NotificationService: ServerDeletedNotification', data)
        if (appStore.selectedServer?.id == data.serverId) {
          console.log('NotificationService: Refreshing servers and moving to directs')
          appStore.setDirects()
          await serverStore.refreshUserServers()
        }
      }
    )

    notificationService.on(
      ServerUpdatedNotification.type,
      async (data: ServerUpdatedNotification) => {
        console.log('NotificationService: ServerUpdatedNotification', data)
        if (appStore.selectedServer?.id == data.serverId) {
          console.log('NotificationService: Refreshing servers')
          await serverStore.refreshUserServers()
        }
      }
    )
  }

  function setupChannelsListeners() {
    notificationService.on(
      ChannelCreatedNotification.type,
      async (data: ChannelCreatedNotification) => {
        console.log('NotificationService: ChannelCreatedNotification', data)
        if (appStore.selectedServer?.id == data.serverId) {
          console.log('NotificationService: Refreshing servers')
          await serverStore.refreshUserServers()
        }
      }
    )
    notificationService.on(
      ChannelUpdatedNotification.type,
      async (data: ChannelUpdatedNotification) => {
        console.log('NotificationService: ChannelUpdatedNotification', data)
        if (appStore.selectedServer?.id == data.serverId) {
          console.log('NotificationService: Refreshing servers')
          await serverStore.refreshUserServers()
        }
      }
    )

    notificationService.on(
      ChannelDeletedNotification.type,
      async (data: ChannelDeletedNotification) => {
        console.log('NotificationService: ChannelDeletedNotification', data)
        if (appStore.selectedServer?.id == data.serverId) {
          console.log('NotificationService: Refreshing servers')
          await serverStore.refreshUserServers()
        }
      }
    )
  }

  function setupUsersListeners() {
    notificationService.on(UserOnlineNotification.type, async (data: UserOnlineNotification) => {
      console.log('NotificationService: UserOnlineNotification', data)
      friendsStore.refreshFriends()
    })

    notificationService.on(UserOfflineNotification.type, async (data: UserOfflineNotification) => {
      console.log('NotificationService: UserOfflineNotification', data)
      friendsStore.refreshFriends()
    })

    notificationService.on(
      UserJoinedServerNotification.type,
      async (data: UserJoinedServerNotification) => {
        console.log('NotificationService: UserJoinedServerNotification', data)
        if (appStore.selectedServer?.id == data.serverId) {
          console.log('NotificationService: Refreshing servers')
          serverStore.refreshUserServers()
        }
      }
    )

    notificationService.on(
      UserLeftServerNotification.type,
      async (data: UserLeftServerNotification) => {
        console.log('NotificationService: UserLeftServerNotification', data)
        if (appStore.selectedServer?.id == data.serverId) {
          console.log('NotificationService: Refreshing servers and moving to directs')
          appStore.setDirects()
          serverStore.refreshUserServers()
        }
      }
    )
  }

  function setupFriendsListeners() {
    notificationService.on(
      FriendRequestNotification.type,
      async (data: FriendRequestNotification) => {
        console.log('NotificationService: FriendRequestNotification', data)
        notificationsStore.addFriendRequest(data.from)
      }
    )

    notificationService.on(
      FriendRequestAcceptedNotification.type,
      async (data: FriendRequestAcceptedNotification) => {
        console.log('NotificationService: FriendRequestAcceptedNotification', data)
        notificationsStore.addFriendRequestAccepted(data.from)
      }
    )
  }

  setupMessagesListeners()
  setupServersListeners()
  setupChannelsListeners()
  setupUsersListeners()
  setupFriendsListeners()
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
    notificationService.callbacks[data.type](data)
  })
}
