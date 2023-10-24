import {
  NotificationController,
  NotificationControllerImpl,
} from '@controllers/notification-controller'
import { ClientProxy } from '@models/client-proxy'
import { Server, Socket } from 'socket.io'
import { decodeAccessToken, isAccessTokenValid } from '@commons/utils/jwt'
import http from 'http'

export class NotificationSocketServer {
  private io: Server
  private notificationController: NotificationController =
    new NotificationControllerImpl()

  constructor(server: http.Server) {
    console.log('Starting notification socket server')
    const test = new Server(server, {
      path: '/webrtc',
    })
    test.on('connection', async (socket) => {
      console.log('New connection on webrtc')
      return socket
    })
    this.io = new Server(server, {
      path: '/notification',
    })
    this.io.on('connection', async (socket) => {
      const jwt = this.getTokenFromHeadersCookie(socket.handshake.headers.cookie)
      await this.validateTokenOrDisconnect(socket, jwt)
      const username = decodeAccessToken(jwt!)?.username
      if (username) {
        const clientProxy = new ClientProxy(socket)
        this.notificationController.subscribe(username, clientProxy)
        socket.on('disconnect', () => {
          this.notificationController.unsubscribe(username)
        })
      }
    })
  }

  private getTokenFromHeadersCookie(headers?: string): string | undefined {
    return headers
      ?.split(';')
      .find((c) => c.includes('jwt'))
      ?.split('=')[1]
  }

  private async validateTokenOrDisconnect(socket: Socket, token?: string): Promise<void> {
    if (token && !isAccessTokenValid(token)) {
      console.log('Invalid token')
      socket.disconnect()
      return
    }
  }
}
