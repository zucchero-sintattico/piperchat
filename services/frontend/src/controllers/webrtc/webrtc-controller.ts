import io, { Socket } from 'socket.io-client'
import { type SessionHandler, SessionHandlerImpl } from './session-handler'
import { AxiosController } from '../axios-controller'
import {
  GetChannelSessionIdApi,
  GetDirectSessionIdApi,
  GetUsersInSession
} from '@api/webrtc/session'
export interface WebRTCController {
  getUsersInSession(sessionId: string): Promise<string[]>
  joinChannel(serverId: string, channelId: string): Promise<SessionHandler>
  joinDirectSession(username: string): Promise<SessionHandler>
}

export class WebRTCControllerImpl extends AxiosController implements WebRTCController {
  private socket: Socket

  constructor(token: string) {
    super()
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      auth: {
        token: token
      }
    })
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket.connected) {
        resolve()
        return
      }
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

  private async getChannelSessionId(serverId: string, channelId: string): Promise<string> {
    const response = await this.get<GetChannelSessionIdApi.Response>(
      `/servers/${serverId}/channels/${channelId}/session`
    )
    if (response.statusCode !== 200) {
      throw new Error('Channel not found')
    }
    const typed = response as GetChannelSessionIdApi.Responses.Success
    return typed.sessionId
  }

  async joinChannel(serverId: string, channelId: string): Promise<SessionHandler> {
    await this.connect()
    const sessionId = await this.getChannelSessionId(serverId, channelId)
    return new SessionHandlerImpl(this.socket, sessionId)
  }

  private async getDirectSessionId(username: string): Promise<string> {
    const response = await this.get<GetDirectSessionIdApi.Response>(`/users/${username}/session`)
    if (response.statusCode !== 200) {
      throw new Error('Friendship not found')
    }
    const typed = response as GetDirectSessionIdApi.Responses.Success
    return typed.sessionId
  }

  async joinDirectSession(username: string): Promise<SessionHandler> {
    await this.connect()
    const sessionId = await this.getDirectSessionId(username)
    return new SessionHandlerImpl(this.socket, sessionId)
  }

  async getUsersInSession(sessionId: string): Promise<string[]> {
    const response = await this.get<GetUsersInSession.Response>(`/sessions/${sessionId}`)
    if (response.statusCode !== 200) {
      throw new Error('Session not found')
    }
    const typed = response as GetUsersInSession.Responses.Success
    return typed.users
  }
}
