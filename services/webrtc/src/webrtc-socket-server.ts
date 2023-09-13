import { Server, Socket } from 'socket.io'
import { decodeAccessToken, isAccessTokenValid } from '@commons/utils/jwt'
import http from 'http'
import {
  ChannelRepository,
  ChannelRepositoryImpl,
} from './repositories/channels/channel-repository'
import {
  FriendshipRepository,
  FriendshipRepositoryImpl,
} from './repositories/friendships/friendship-repository'

export class WebRTCSocketServer {
  private channelRepository: ChannelRepository = new ChannelRepositoryImpl()
  private friendshipRepository: FriendshipRepository = new FriendshipRepositoryImpl()
  private io: Server

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    })
    this.io.on('connection', (socket) => {
      if (!isAccessTokenValid(socket.handshake.auth.token)) {
        console.log('Invalid token')
        socket.disconnect()
        return
      }
      const username = decodeAccessToken(socket.handshake.auth.token)?.username
      if (username) {
        this.handleSocket(socket, username)
      }
    })
  }

  async handleSocket(socket: Socket, username: string) {
    console.log('Socket connected', socket.id, username)

    socket.on('join-channel', async (serverId: string, channelId: string) =>
      this.handleMultimediaChannelProtocol(socket, username, serverId, channelId)
    )

    socket.on('join-user', async (username2: string) =>
      this.handleInfraUserProtocol(socket, username, username2)
    )
  }

  async handleInfraUserProtocol(
    socket: Socket,
    myUsername: string,
    friendUsername: string
  ) {
    try {
      if (
        !(await this.friendshipRepository.areUsersFriends(myUsername, friendUsername))
      ) {
        console.log('Users are not friends')
        socket.disconnect()
        return
      }
    } catch (e) {
      console.log('User not found')
      socket.disconnect()
      return
    }

    const userInFriendship = await this.friendshipRepository.getUserInFriendship(
      myUsername,
      friendUsername
    )
    if (userInFriendship.socketId) {
      console.log('User already in session, disconnecting')
      socket.disconnect()
      return
    }

    await this.friendshipRepository.addSocketIdToFriendship(
      myUsername,
      friendUsername,
      socket.id
    )

    const friendship = await this.friendshipRepository.getFriendship(
      myUsername,
      friendUsername
    )

    socket.to(friendship._id).emit('user-connected', myUsername)
    socket.join(friendship._id)

    socket.on('disconnect', async () => {
      console.log('Disconnecting user:', myUsername)
      socket.to(friendship._id).emit('user-disconnected', myUsername)

      await this.friendshipRepository.removeSocketIdFromFriendship(
        myUsername,
        friendUsername
      )
    })

    socket.on('offer', async (offer, to) => {
      const user = await this.friendshipRepository.getUserInFriendship(to, myUsername)
      this.io.sockets.sockets.get(user.socketId)?.emit('offer', offer, myUsername)
    })

    socket.on('answer', async (answer, to) => {
      const user = await this.friendshipRepository.getUserInFriendship(to, myUsername)
      this.io.sockets.sockets.get(user.socketId)?.emit('answer', answer, myUsername)
    })

    socket.on('ice-candidate', async (candidate, to) => {
      const user = await this.friendshipRepository.getUserInFriendship(to, myUsername)
      this.io.sockets.sockets
        .get(user.socketId)
        ?.emit('ice-candidate', candidate, myUsername)
    })
  }

  async handleMultimediaChannelProtocol(
    socket: Socket,
    username: string,
    serverId: string,
    channelId: string
  ) {
    console.log('Joining channel', channelId, 'on server', serverId)
    try {
      if (!(await this.channelRepository.isUserParticipantInServer(serverId, username))) {
        console.log('User not allowed in session')
        socket.disconnect()
        return
      }
    } catch (e) {
      console.log('Channel not found')
      socket.disconnect()
      return
    }

    const userAlreadyInSession = await this.channelRepository.getUserInChannel(
      serverId,
      channelId,
      username
    )

    const isUserAlreadyInSession = userAlreadyInSession !== undefined

    if (isUserAlreadyInSession) {
      console.log('User already in session, disconnecting')
      socket.disconnect()
      return
    }

    await this.channelRepository.addUserToChannel(serverId, username, socket.id)

    socket.to(channelId).emit('user-connected', username)
    socket.join(channelId)

    // TODO: Change names
    // this.sessionEventsRepository.publishUserJoinedSessionEvent(channelId, username)

    socket.on('disconnect', async () => {
      console.log('Disconnecting user:', username)
      socket.to(channelId).emit('user-disconnected', username)

      this.channelRepository.removeUserFromChannel(serverId, channelId, username)

      // TODO: Change names
      // this.sessionEventsRepository.publishUserLeftSessionEvent(channelId, username)

      const usersInSession = await this.channelRepository.getUsersInChannel(
        serverId,
        channelId
      )

      if (usersInSession.length === 0) {
        // TODO: Change names
        // this.sessionEventsRepository.publishSessionEndedEvent(channelId)
      }
    })

    socket.on('offer', async (offer, to) => {
      const user = await this.channelRepository.getUserInChannel(serverId, channelId, to)
      this.io.sockets.sockets.get(user.socketId)?.emit('offer', offer, username)
    })

    socket.on('answer', async (answer, to) => {
      const user = await this.channelRepository.getUserInChannel(serverId, channelId, to)
      this.io.sockets.sockets.get(user.socketId)?.emit('answer', answer, username)
    })

    socket.on('ice-candidate', async (candidate, to) => {
      const user = await this.channelRepository.getUserInChannel(serverId, channelId, to)
      this.io.sockets.sockets
        .get(user.socketId)
        ?.emit('ice-candidate', candidate, username)
    })
  }
}
