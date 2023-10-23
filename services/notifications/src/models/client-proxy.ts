import { Socket } from 'socket.io'

export class ClientProxy {
  private readonly socket: Socket

  constructor(socket: Socket) {
    this.socket = socket
  }

  public send(data: object) {
    this.socket.emit('notification', data)
  }
}
