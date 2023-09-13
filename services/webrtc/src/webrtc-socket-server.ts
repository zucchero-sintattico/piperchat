import { Server, Socket } from 'socket.io'
import { decodeAccessToken, isAccessTokenValid } from '@commons/utils/jwt'
import http from 'http'
import {
  ChannelRepository,
  ChannelRepositoryImpl,
} from './repositories/channel-repository'
import {
  FriendshipRepository,
  FriendshipRepositoryImpl,
} from './repositories/friendship-repository'
import { Session } from '@models/session-model'
import {
  SessionRepository,
  SessionRepositoryImpl,
} from './repositories/session-repository'
import { EventsRepository, EventsRepositoryImpl } from './repositories/events-repository'
import { Servers } from './models/server-model'
import { Friendships } from './models/friendship-model'

export class WebRTCSocketServer {
  private channelRepository: ChannelRepository = new ChannelRepositoryImpl()
  private friendshipRepository: FriendshipRepository = new FriendshipRepositoryImpl()
  private sessionRepository: SessionRepository = new SessionRepositoryImpl()
  private eventsRepository: EventsRepository = new EventsRepositoryImpl()
  private io: Server

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    })
    this.io.on('connection', async (socket) => {
      await this.validateTokenOrDisconnect(socket.handshake.auth.token, socket)
      const username = decodeAccessToken(socket.handshake.auth.token)?.username
      if (username) {
        socket.on('join-session', async (sessionId: string) =>
          this.handleSession(socket, username, sessionId)
        )
      }
    })
  }

  private async validateTokenOrDisconnect(token: string, socket: Socket): Promise<void> {
    if (!isAccessTokenValid(token)) {
      console.log('Invalid token')
      socket.disconnect()
      return
    }
  }

  private async handleSession(socket: Socket, username: string, sessionId: string) {
    console.log('Joining session', sessionId)
    await this.checkIfIsChannelOrDirectSessionAndPublishJoinEvent(sessionId, username)
    const session = await this.getSessionOrDisconnect(sessionId, socket)
    await this.validateUserAllowedInSessionOrDisconnect(session, username, socket)
    await this.validateUserNotAlreadyInSessionOrDisconnect(session, username, socket)
    await this.sessionRepository.addUserToSession(sessionId, username, socket.id)
    socket.to(sessionId).emit('user-connected', username)
    socket.join(sessionId)
    socket.on('disconnect', async () => {
      console.log('Disconnecting user:', username)
      socket.to(sessionId).emit('user-disconnected', username)
      await this.sessionRepository.removeUserFromSession(sessionId, username)
      await this.checkIfIsChannelOrDirectSessionAndPublishLeaveEvent(sessionId, username)
    })
    socket.on('offer', async (offer, to) => {
      const user = await this.sessionRepository.getUserInSession(sessionId, to)
      this.io.sockets.sockets.get(user?.socketId)?.emit('offer', offer, username)
    })
    socket.on('answer', async (answer, to) => {
      const user = await this.sessionRepository.getUserInSession(sessionId, to)
      this.io.sockets.sockets.get(user?.socketId)?.emit('answer', answer, username)
    })
    socket.on('ice-candidate', async (candidate, to) => {
      const user = await this.sessionRepository.getUserInSession(sessionId, to)
      this.io.sockets.sockets
        .get(user?.socketId)
        ?.emit('ice-candidate', candidate, username)
    })
  }

  private async checkIfIsChannelOrDirectSessionAndPublishJoinEvent(
    sessionId: string,
    username: string
  ) {
    try {
      // Search a server with a channel with the given sessionId and retrieve the channel
      const server = await Servers.findOne({
        'channels.id': sessionId,
      })
      const channel = server?.channels.find((c) => c.id === sessionId)
      if (channel) {
        this.eventsRepository.publishUserJoinedChannelEvent(
          server?.id,
          channel.id,
          username
        )
      }
      return
    } catch (e) {
      //
    }
    try {
      const friendship = await Friendships.findOne({
        sessionId: sessionId,
      })
      if (friendship) {
        const friend =
          friendship.first === username ? friendship.second : friendship.first
        this.eventsRepository.publishUserJoinedDirectSessionEvent(username, friend)
      }
    } catch (e) {
      //
    }
  }

  private async checkIfIsChannelOrDirectSessionAndPublishLeaveEvent(
    sessionId: string,
    username: string
  ) {
    try {
      // Search a server with a channel with the given sessionId and retrieve the channel
      const server = await Servers.findOne({
        'channels.id': sessionId,
      })
      const channel = server?.channels.find((c) => c.id === sessionId)
      if (channel) {
        this.eventsRepository.publishUserLeftChannelEvent(
          server?.id,
          channel.id,
          username
        )
      }
      return
    } catch (e) {
      //
    }
    try {
      const friendship = await Friendships.findOne({
        sessionId: sessionId,
      })
      if (friendship) {
        const friend =
          friendship.first === username ? friendship.second : friendship.first
        this.eventsRepository.publishUserLeftDirectSessionEvent(username, friend)
      }
    } catch (e) {
      //
    }
  }

  private async getSessionOrDisconnect(
    sessionId: string,
    socket: Socket
  ): Promise<Session> {
    try {
      return await this.sessionRepository.getSession(sessionId)
    } catch (e) {
      console.log('Session not found')
      socket.disconnect()
      throw e
    }
  }

  private async validateUserAllowedInSessionOrDisconnect(
    session: Session,
    username: string,
    socket: Socket
  ) {
    if (!session.allowedUsers.includes(username)) {
      console.log('User not allowed in session')
      socket.disconnect()
      return
    }
  }

  private async validateUserNotAlreadyInSessionOrDisconnect(
    session: Session,
    username: string,
    socket: Socket
  ) {
    const userAlreadyInSession = session.participants.find((p) => p.username === username)
    const isUserAlreadyInSession = userAlreadyInSession !== undefined
    if (isUserAlreadyInSession) {
      console.log('User already in session, disconnecting')
      socket.disconnect()
      return
    }
  }
}
