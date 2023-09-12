import io, { Socket } from 'socket.io-client'
import { type ChannelCallHandler, ChannelCallHandlerImpl } from './channel-call-handler'

export interface WebRTCController {
  joinChannel(serverId: string, channelId: string): Promise<ChannelCallHandler>
}

export class WebRTCControllerImpl implements WebRTCController {
  private socket: Socket
  constructor(token: string) {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      auth: {
        token: token
      }
    })
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        console.log('Connected to webrtc service')
        resolve()
      })
      this.socket.on('connect_error', (err) => {
        reject(err)
      })
      this.socket.connect()
    })
  }

  async joinChannel(serverId: string, channelId: string): Promise<ChannelCallHandler> {
    await this.connect()
    return new ChannelCallHandlerImpl(this.socket, serverId, channelId)
  }
}
