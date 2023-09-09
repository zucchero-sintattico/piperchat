export class ServerCreated {
  static exchange = 'server'
  static routingKey = 'server.created'

  id: string
  name: string
  description: string
  owner: string
  constructor(data: { id: string; name: string; description: string; owner: string }) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.owner = data.owner
  }
}

export class ServerUpdated {
  static exchange = 'server'
  static routingKey = 'server.updated'

  id: string
  name?: string
  description?: string
  constructor(data: { id: string; name?: string; description?: string }) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
  }
}

export class ServerDeleted {
  static exchange = 'server'
  static routingKey = 'server.deleted'

  id: string
  constructor(data: { id: string }) {
    this.id = data.id
  }
}

export class UserJoinedServer {
  static exchange = 'server'
  static routingKey = 'user.joined'

  serverId: string
  username: string
  constructor(data: { serverId: string; username: string }) {
    this.serverId = data.serverId
    this.username = data.username
  }
}

export class UserLeftServer {
  static exchange = 'server'
  static routingKey = 'user.left'

  serverId: string
  username: string
  constructor(data: { serverId: string; username: string }) {
    this.serverId = data.serverId
    this.username = data.username
  }
}

export class UserKickedFromServer {
  static exchange = 'server'
  static routingKey = 'user.kicked'

  serverId: string
  username: string
  constructor(data: { serverId: string; username: string }) {
    this.serverId = data.serverId
    this.username = data.username
  }
}
