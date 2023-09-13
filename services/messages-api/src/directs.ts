export class NewMessageOnDirect {
  static exchange = 'direct'
  static routingKey = 'message.new'

  sender: string
  receiver: string
  message: string
  constructor(data: { sender: string; receiver: string; message: string }) {
    this.sender = data.sender
    this.receiver = data.receiver
    this.message = data.message
  }
}

export class UserJoinedDirectCall {
  static exchange = 'direct'
  static routingKey = 'user.joined'

  joiner: string
  other: string
  constructor(data: { joiner: string; other: string }) {
    this.joiner = data.joiner
    this.other = data.other
  }
}

export class UserLeftDirectCall {
  static exchange = 'direct'
  static routingKey = 'user.left'

  leaver: string
  other: string
  constructor(data: { leaver: string; other: string }) {
    this.leaver = data.leaver
    this.other = data.other
  }
}
