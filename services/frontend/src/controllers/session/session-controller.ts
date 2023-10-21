import io, { Socket } from 'socket.io-client'
import { type SessionHandler, SessionHandlerImpl } from './session-handler'
import { AxiosController } from '../axios-controller'
import {
  GetChannelSessionIdApi,
  GetDirectSessionIdApi,
  GetUsersInSession
} from '@api/webrtc/session'
export interface SessionController {
  getUsersInSession(sessionId: string): Promise<string[]>
  joinChannel(serverId: string, channelId: string): Promise<SessionHandler>
  joinDirectSession(username: string): Promise<SessionHandler>
}

export class SessionControllerImpl extends AxiosController implements SessionController {
  private token: string

  constructor(token: string) {
    super()
    this.token = token
  }

  private createSocket(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socket = io('/webrtc', {
        transports: ['websocket'],
        path: '/webrtc',
        auth: {
          token: this.token
        }
      })
      socket.on('connect', () => {
        console.log('Connected to webrtc service')
        resolve(socket)
      })
      socket.on('connect_error', (err) => {
        console.log(err)
        reject(err)
      })
      socket.connect()
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
    const socket = await this.createSocket()
    const sessionId = await this.getChannelSessionId(serverId, channelId)
    return new SessionHandlerImpl(socket, sessionId)
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
    const socket = await this.createSocket()
    const sessionId = await this.getDirectSessionId(username)
    return new SessionHandlerImpl(socket, sessionId)
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
