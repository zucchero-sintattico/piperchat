import { EventMessage } from './event-message'

interface UserInfo {
  username: string
  email: string
  description: string
  profilePicture: Buffer
  createdAt: Date
}

export class UserCreatedMessage implements EventMessage {
  exchange = 'user'
  routingKey = 'user.created'
  constructor(public data: UserInfo) {}
}

interface UserUpdatedInfo {
  username: string
  email?: string
  description?: string
  profilePicture?: Buffer
}

export class UserUpdatedMessage implements EventMessage {
  exchange = 'user'
  routingKey = 'user.updated'
  constructor(public data: UserUpdatedInfo) {}
}

export class UserDeletedMessage implements EventMessage {
  exchange = 'user'
  routingKey = 'user.deleted'
  constructor(public data: { username: string }) {}
}

export class UserLoggedInMessage implements EventMessage {
  exchange = 'user'
  routingKey = 'user.logged.in'
  constructor(public data: { username: string }) {}
}

export class UserLoggedOutMessage implements EventMessage {
  exchange = 'user'
  routingKey = 'user.logged.out'
  constructor(public data: { username: string }) {}
}
