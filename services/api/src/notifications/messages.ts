export class NewMessageOnDirectNotification {
  type = 'new-direct-message' as const
  from: string
  content: string
  constructor(data: { from: string; content: string }) {
    this.from = data.from
    this.content = data.content
  }
}

export class NewMessageOnChannelNotification {
  type = 'new-channel-message' as const
  from: string
  content: string
  channel: string
  constructor(data: { from: string; content: string; channel: string }) {
    this.from = data.from
    this.content = data.content
    this.channel = data.channel
  }
}

export class FriendRequestNotification {
  type = 'friend-request' as const
  from: string
  constructor(data: { from: string }) {
    this.from = data.from
  }
}

export class FriendRequestAcceptedNotification {
  type = 'friend-request-accepted' as const
  from: string
  constructor(data: { from: string }) {
    this.from = data.from
  }
}

export class UserOnlineNotification {
  type = 'user-online' as const
  user: string
  constructor(data: { user: string }) {
    this.user = data.user
  }
}

export class UserOfflineNotification {
  type = 'user-offline' as const
  user: string
  constructor(data: { user: string }) {
    this.user = data.user
  }
}
