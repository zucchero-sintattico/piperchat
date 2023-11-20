import { Servers, Server, Channel } from '@/models/server-model'
import { SessionRepository, SessionRepositoryImpl } from './session-repository'

export interface ChannelRepository {
  createServer(serverId: string, owner: string): Promise<Server>
  deleteServer(serverId: string): Promise<void>
  getServer(serverId: string): Promise<Server>
  addServerParticipant(serverId: string, username: string): Promise<void>
  removeServerParticipant(serverId: string, username: string): Promise<void>

  createChannelInServer(
    serverId: string,
    channelId: string,
    sessionId: string
  ): Promise<Channel>
  deleteChannelInServer(serverId: string, channelId: string): Promise<void>
  getChannelsInServer(serverId: string): Promise<Channel[]>
  getChannelInServer(serverId: string, channelId: string): Promise<Channel>
}

export class ChannelRepositoryImpl implements ChannelRepository {
  private sessionRepository: SessionRepository = new SessionRepositoryImpl()

  async createServer(serverId: string, owner: string): Promise<Server> {
    const server = await Servers.create({
      _id: serverId,
      participants: [owner],
    })
    return server
  }

  async deleteServer(serverId: string): Promise<void> {
    await Servers.findByIdAndDelete(serverId)
  }

  async getServer(serverId: string): Promise<Server> {
    return await Servers.findById(serverId).orFail()
  }

  async addServerParticipant(serverId: string, username: string): Promise<void> {
    await Servers.findByIdAndUpdate(serverId, { $addToSet: { participants: username } })
    const server = await Servers.findById(serverId).orFail()
    const channels = server.channels
    for (const channel of channels) {
      await this.sessionRepository.addAllowedUserToSession(channel.sessionId, username)
    }
  }

  async removeServerParticipant(serverId: string, username: string): Promise<void> {
    await Servers.findByIdAndUpdate(serverId, { $pull: { participants: username } })
    const server = await Servers.findById(serverId).orFail()
    const channels = server.channels
    for (const channel of channels) {
      await this.sessionRepository.removeAllowedUserFromSession(
        channel.sessionId,
        username
      )
    }
  }

  async createChannelInServer(
    serverId: string,
    channelId: string,
    sessionId: string
  ): Promise<Channel> {
    const server = await Servers.findById(serverId).orFail()
    const channel: Channel = {
      id: channelId,
      sessionId: sessionId,
    }
    server.channels.push(channel)
    await server.save()
    return channel
  }

  async deleteChannelInServer(serverId: string, channelId: string): Promise<void> {
    await Servers.findByIdAndUpdate(serverId, { $pull: { channels: { id: channelId } } })
  }

  async getChannelsInServer(serverId: string): Promise<Channel[]> {
    const server = await Servers.findById(serverId).orFail()
    return server.channels
  }

  async getChannelInServer(serverId: string, channelId: string): Promise<Channel> {
    const server = await Servers.findById(serverId).orFail()
    const channel = server.channels.find((channel) => channel.id === channelId)
    if (!channel) throw new Error('Channel not found')
    return channel
  }
}
