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
