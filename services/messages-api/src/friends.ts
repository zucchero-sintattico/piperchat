export class FriendRequestSentMessage {
  static exchange = 'friend'
  static routingKey = 'friend.request.sent'

  from: string
  to: string
  constructor(data: { from: string; to: string }) {
    this.from = data.from
    this.to = data.to
  }
}

export class FriendRequestAcceptedMessage {
  static exchange = 'friend'
  static routingKey = 'friend.request.accepted'

  from: string
  to: string
  constructor(data: { from: string; to: string }) {
    this.from = data.from
    this.to = data.to
  }
}

export class FriendRequestDeniedMessage {
  static exchange = 'friend'
  static routingKey = 'friend.request.denied'

  from: string
  to: string
  constructor(data: { from: string; to: string }) {
    this.from = data.from
    this.to = data.to
  }
}
