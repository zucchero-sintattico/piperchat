export class ChannelCreated {
  static exchange = 'channel'
  static routingKey = 'channel.created'

  serverId: string
  channelId: string
  name: string
  channelType: string
  description?: string
  constructor(data: {
    serverId: string
    channelId: string
    name: string
    channelType: string
    description?: string
  }) {
    this.serverId = data.serverId
    this.channelId = data.channelId
    this.name = data.name
    this.channelType = data.channelType
    this.description = data.description
  }
}

export class ChannelUpdated {
  static exchange = 'channel'
  static routingKey = 'channel.updated'

  serverId: string
  channelId: string
  name?: string
  description?: string
  constructor(data: {
    serverId: string
    channelId: string
    name?: string
    description?: string
  }) {
    this.serverId = data.serverId
    this.channelId = data.channelId
    this.name = data.name
    this.description = data.description
  }
}

export class ChannelDeleted {
  static exchange = 'channel'
  static routingKey = 'channel.deleted'

  serverId: string
  channelId: string
  constructor(data: { serverId: string; channelId: string }) {
    this.serverId = data.serverId
    this.channelId = data.channelId
  }
}

export class NewMessageOnChannel {
  static exchange = 'channel'
  static routingKey = 'message.new'

  serverId: string
  channelId: string
  sender: string
  message: string
  constructor(data: {
    serverId: string
    channelId: string
    sender: string
    message: string
  }) {
    this.serverId = data.serverId
    this.channelId = data.channelId
    this.sender = data.sender
    this.message = data.message
  }
}

export class UserJoinedMultimediaChannel {
  static exchange = 'multimedia'
  static routingKey = 'user.joined'

  serverId: string
  channelId: string
  username: string
  constructor(data: { serverId: string; channelId: string; username: string }) {
    this.serverId = data.serverId
    this.channelId = data.channelId
    this.username = data.username
  }
}

export class UserLeftMultimediaChannel {
  static exchange = 'multimedia'
  static routingKey = 'user.left'

  serverId: string
  channelId: string
  username: string
  constructor(data: { serverId: string; channelId: string; username: string }) {
    this.serverId = data.serverId
    this.channelId = data.channelId
    this.username = data.username
  }
}
