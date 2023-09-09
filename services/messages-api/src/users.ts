export class UserCreatedMessage {
  static exchange = 'user'
  static routingKey = 'user.created'

  username: string
  email: string
  description?: string
  profilePicture?: Buffer
  constructor(data: {
    username: string
    email: string
    description?: string
    profilePicture?: Buffer
  }) {
    this.username = data.username
    this.email = data.email
    this.description = data.description
    this.profilePicture = data.profilePicture
  }
}

export class UserUpdatedMessage {
  static exchange = 'user'
  static routingKey = 'user.updated'

  username: string
  email?: string
  description?: string
  profilePicture?: Buffer
  constructor(data: {
    username: string
    email?: string
    description?: string
    profilePicture?: Buffer
  }) {
    this.username = data.username
    this.email = data.email
    this.description = data.description
    this.profilePicture = data.profilePicture
  }
}

export class UserDeletedMessage {
  static exchange = 'user'
  static routingKey = 'user.deleted'

  username: string
  constructor(data: { username: string }) {
    this.username = data.username
  }
}

export class UserLoggedInMessage {
  static exchange = 'user'
  static routingKey = 'user.logged.in'

  username: string
  constructor(data: { username: string }) {
    this.username = data.username
  }
}

export class UserLoggedOutMessage {
  static exchange = 'user'
  static routingKey = 'user.logged.out'

  username: string
  constructor(data: { username: string }) {
    this.username = data.username
  }
}
