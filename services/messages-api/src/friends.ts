import { EventMessage } from './event-message'

export class FriendRequestSentMessage implements EventMessage {
  exchange = 'friend'
  routingKey = 'friend.request.sent'
  constructor(public data: { from: string; to: string }) {}
}

export class FriendRequestAcceptedMessage implements EventMessage {
  exchange = 'friend'
  routingKey = 'friend.request.accepted'
  constructor(public data: { from: string; to: string }) {}
}

export class FriendRequestDeniedMessage implements EventMessage {
  exchange = 'friend'
  routingKey = 'friend.request.denied'
  constructor(public data: { from: string; to: string }) {}
}
