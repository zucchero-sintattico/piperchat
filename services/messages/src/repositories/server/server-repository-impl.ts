import { ServerRepository } from './server-repository'
import { Servers } from '@models/messages-model'

export class ServerRepositoryImpl implements ServerRepository {
  async addParticipant(serverId: string, participantId: string): Promise<void> {
    await Servers.updateOne({ id: serverId }, { $push: { participants: participantId } })
  }

  async removeParticipant(serverId: string, partecipantId: string): Promise<void> {
    await Servers.findOneAndUpdate(
      { id: serverId },
      { $pull: { participants: partecipantId } }
    ).orFail()
  }

  async addServer(serverId: string, participantId: string): Promise<void> {
    await Servers.create({ id: serverId, participants: [participantId] })
  }

  async getServerParticipants(serverId: string): Promise<string[]> {
    const server = await Servers.findOne({ id: serverId })
    if (server) {
      return server.participants
    }
    throw new Error('Server not found')
  }

  async removeServer(serverId: string): Promise<void> {
    await Servers.findOneAndDelete({ id: serverId }).orFail()
  }

  async addMessageChannel(serverId: string, channelId: string): Promise<void> {
    await Servers.updateOne(
      { id: serverId },
      {
        $push: {
          channels: {
            id: channelId,
            messages: [],
          },
        },
      }
    )
  }

  async removeMessageChannel(serverId: string, channelId: string): Promise<void> {
    await Servers.updateOne({ id: serverId }, { $pull: { channels: { id: channelId } } })
  }

  async containsMessageChannel(serverId: string, channelId: string): Promise<boolean> {
    const server = await Servers.findOne({ id: serverId })
    if (server) {
      return server.messagesChannels.some((channel) => channel.id == channelId)
    }
    throw new Error('Server not found')
  }
}
