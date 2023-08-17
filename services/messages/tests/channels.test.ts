import mongoose, { Mongoose } from "mongoose";
import { ChannelControllerImpl } from "../src/controllers/channel/channel-controller-impl";
import { ChannelControllerExceptions } from "../src/controllers/channel/channel-controller";
import { Servers } from "../src/models/messages-model";
import { ServerRepositoryImpl } from "../src/repositories/server/server-repository-impl";
import { ServerRepository } from "../src/repositories/server/server-repository";


let channelController = new ChannelControllerImpl();
let serverRepository: ServerRepository = new ServerRepositoryImpl();

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/");
});

afterAll(async () => {
    await mongoose.connection.close();
});


afterEach(async () => {
    //await MessageChannels.deleteMany({});
    await Servers.deleteMany({});
});

//channel tests
describe("CREATE operation", () => {
    it("create 4 channel in the server", async () => {
        await serverRepository.addServer("serverId", "owner");
        await channelController.createChannel("serverId", "channelType");
        await channelController.createChannel("serverId", "channelType2");
        await channelController.createChannel("serverId", "channelType3");
        await channelController.createChannel("serverId", "channelType4");
        const channels = await channelController.getChannels("serverId");
        expect(channels.length).toBe(4);
    }
    );

    it("should not create channel if server does not exist", async () => {
        await expect(channelController.createChannel("serverId", "channelType")).rejects.toThrow(new ChannelControllerExceptions.ServerNotFound());
    });

});


describe("chat tests", () => {
    it("should send a message", async () => {
        await serverRepository.addServer("serverId", "owner");
        await channelController.createChannel("serverId", "channelType");
        const channelId = (await channelController.getChannels("serverId"))[0].id;
        await channelController.sendMessage(channelId, "serverId", "sender", "message");
        const messages = await channelController.getMessages("channelType", "serverId");
        expect(messages.length).toBe(1);
    });
    it("send a lot of messages from different users", async () => {
        await serverRepository.addServer("serverId", "owner");
        await channelController.createChannel("serverId", "channelType");
        const channelId = (await channelController.getChannels("serverId"))[0].id;
        await channelController.sendMessage(channelId, "serverId", "sender", "message");
        await channelController.sendMessage(channelId, "serverId", "sender2", "message2");
        await channelController.sendMessage(channelId, "serverId", "sender3", "message3");
        await channelController.sendMessage(channelId, "serverId", "sender4", "message4");
        const messages = await channelController.getMessages("channelType", "serverId");
        expect(messages.length).toBe(4);
    });

});

