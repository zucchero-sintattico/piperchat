import { ServerRepository } from './server-repository';
import { Servers } from '../../models/messages-model';

export class ServerRepositoryImpl implements ServerRepository {

    async addPartecipant(serverId: string, partecipantId: string): Promise<void> {
        await Servers.updateOne({ id: serverId }, { $push: { partecipants: partecipantId } });
    }

    async removePartecipant(serverId: string, partecipantId: string): Promise<void> {
        await Servers.findOneAndUpdate({ id: serverId }, { $pull: { partecipants: partecipantId } }).orFail();

    }

    async addServer(serverId: string, partecipantId: string): Promise<void> {
        await Servers.create({ id: serverId, partecipants: [partecipantId] });
    }

    async getServerPartecipants(serverId: string): Promise<string[]> {
        const server = await Servers.findOne({ id: serverId });
        if (server) {
            return server.partecipants;
        }
        throw new Error("Server not found");
    }

    async removeServer(serverId: string): Promise<void> {
        await Servers.findOneAndDelete({ id: serverId }).orFail();
    }

    async addMessageChannel(serverId: string, channelId: string): Promise<void> {
        await Servers.updateOne({ id: serverId }, {
            $push: {
                channels: {
                    id: channelId,
                    messages: []
                }
            }
        });
    }

    async removeMessageChannel(serverId: string, channelId: string): Promise<void> {
        await Servers.updateOne({ id: serverId }, { $pull: { channels: { id: channelId } } });
    }



}

