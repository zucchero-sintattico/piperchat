export class NewMessageNotification {
  type = 'new-message' as const
  from: string
  content: string
  constructor(data: { from: string; content: string }) {
    this.from = data.from
    this.content = data.content
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
