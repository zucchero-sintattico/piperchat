export class NewMessageOnDirectNotification {
  static type = 'new-direct-message' as const
  type = NewMessageOnDirectNotification.type
  from: string
  content: string
  constructor(data: { from: string; content: string }) {
    this.from = data.from
    this.content = data.content
  }
}

export class NewMessageOnChannelNotification {
  static type = 'new-channel-message' as const
  type = NewMessageOnChannelNotification.type
  from: string
  content: string
  serverId: string
  channel: string
  constructor(data: {
    from: string
    content: string
    serverId: string
    channel: string
  }) {
    this.from = data.from
    this.content = data.content
    this.serverId = data.serverId
    this.channel = data.channel
  }
}

export class FriendRequestNotification {
  static type = 'friend-request' as const
  type = FriendRequestNotification.type
  from: string
  constructor(data: { from: string }) {
    this.from = data.from
  }
}

export class FriendRequestAcceptedNotification {
  static type = 'friend-request-accepted' as const
  type = FriendRequestAcceptedNotification.type
  from: string
  constructor(data: { from: string }) {
    this.from = data.from
  }
}

export class UserOnlineNotification {
  static type = 'user-online' as const
  type = UserOnlineNotification.type
  user: string
  constructor(data: { user: string }) {
    this.user = data.user
  }
}

export class UserOfflineNotification {
  static type = 'user-offline' as const
  type = UserOfflineNotification.type
  user: string
  constructor(data: { user: string }) {
    this.user = data.user
  }
}

export class ServerDeletedNotification {
  static type = 'server-deleted' as const
  type = ServerDeletedNotification.type
  serverId: string
  constructor(data: { serverId: string }) {
    this.serverId = data.serverId
  }
}

export class ServerUpdatedNotification {
  static type = 'server-updated' as const
  type = ServerUpdatedNotification.type
  serverId: string
  constructor(data: { serverId: string }) {
    this.serverId = data.serverId
  }
}

export class UserJoinedServerNotification {
  static type = 'user-joined-server' as const
  type = UserJoinedServerNotification.type
  serverId: string
  user: string
  constructor(data: { serverId: string; user: string }) {
    this.serverId = data.serverId
    this.user = data.user
  }
}

export class UserLeftServerNotification {
  static type = 'user-left-server' as const
  serverId: string
  user: string
  constructor(data: { serverId: string; user: string }) {
    this.serverId = data.serverId
    this.user = data.user
  }
}

export class ChannelCreatedNotification {
  static type = 'channel-created' as const
  type = ChannelCreatedNotification.type
  serverId: string
  channel: string
  constructor(data: { serverId: string; channel: string }) {
    this.serverId = data.serverId
    this.channel = data.channel
  }
}

export class ChannelDeletedNotification {
  static type = 'channel-deleted' as const
  type = ChannelDeletedNotification.type
  serverId: string
  channel: string
  constructor(data: { serverId: string; channel: string }) {
    this.serverId = data.serverId
    this.channel = data.channel
  }
}

export class ChannelUpdatedNotification {
  static type = 'channel-updated' as const
  type = ChannelUpdatedNotification.type
  serverId: string
  channel: string
  constructor(data: { serverId: string; channel: string }) {
    this.serverId = data.serverId
    this.channel = data.channel
  }
}
