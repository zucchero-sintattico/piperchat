import { Servers, Channel, UserInChannel } from '@/models/channels-model'

export interface ChannelRepository {
  getUsersInChannel(serverId: string, channelId: string): Promise<UserInChannel[]>
  removeUserFromChannel(
    serverId: string,
    channelId: string,
    username: string
  ): Promise<void>
  addUserToChannel(serverId: string, username: string, socketId: string): Promise<void>
  isUserParticipantInServer(serverId: string, username: string): Promise<boolean>
  getUserInChannel(
    serverId: string,
    channelId: string,
    username: string
  ): Promise<UserInChannel>
}

export class ChannelRepositoryImpl implements ChannelRepository {
  async getUsersInChannel(serverId: string, channelId: string): Promise<UserInChannel[]> {
    const server = await Servers.findOne({ id: serverId }).orFail()
    const channel = server.channels.find((channel: Channel) => channel.id === channelId)
    if (!channel) {
      throw new Error('Channel not found')
    }
    return channel.participants
  }
  async removeUserFromChannel(
    serverId: string,
    channelId: string,
    username: string
  ): Promise<void> {
    const server = await Servers.findOne({ id: serverId }).orFail()
    const channel = server.channels.find((channel: Channel) => channel.id === channelId)
    if (!channel) {
      throw new Error('Channel not found')
    }
    channel.participants = channel.participants.filter(
      (user: UserInChannel) => user.username !== username
    )
    await server.save()
  }
  async addUserToChannel(
    serverId: string,
    username: string,
    socketId: string
  ): Promise<void> {
    const server = await Servers.findOne({ id: serverId }).orFail()
    const channel = server.channels.find((channel: Channel) => channel.id === serverId)
    if (!channel) {
      throw new Error('Channel not found')
    }
    channel.participants.push({ username, socketId: socketId })
    await server.save()
  }
  async getUserInChannel(
    serverId: string,
    channelId: string,
    username: string
  ): Promise<UserInChannel> {
    const server = await Servers.findOne({ id: serverId }).orFail()
    const channel = server.channels.find((channel: Channel) => channel.id === channelId)
    const user = channel?.participants.find(
      (user: UserInChannel) => user.username === username
    )
    if (!user) {
      throw new Error('User not found in channel')
    }
    return user
  }

  async isUserParticipantInServer(serverId: string, username: string): Promise<boolean> {
    const server = await Servers.findOne({ id: serverId }).orFail()
    return server.participants.includes(username)
  }
}
