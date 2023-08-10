import mongoose, { Mongoose } from "mongoose";
import {
  ChannelController,
  ChannelControllerExceptions,
} from "../src/controllers/channel/channel-controller";
import { ChannelControllerImpl } from "../src/controllers/channel/channel-controller-impl";
import { Servers } from "../src/models/server-model";
import {
  ServerController,
  ServerControllerExceptions,
} from "../src/controllers/server/server-controller";
import { ServerControllerImpl } from "../src/controllers/server/server-controller-impl";

let serverController: ServerController;
let channelController: ChannelController;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/");
});

beforeEach(async () => {
  serverController = new ServerControllerImpl();
  channelController = new ChannelControllerImpl();
});

afterEach(async () => {
  await Servers.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("ChannelsCrudOps", () => {
  describe("Get", () => {
    it("A user should be able to get a channel if he is in the server", async () => {
      let server = await createServer("server1", "user1");
      const channel = await createChannel(
        server._id,
        "user1",
        "channel1",
        "text",
        "channel1"
      );
      expect(channel.name).toBe("channel1");
      expect(channel.channelType).toBe("text");
      expect(channel.description).toBe("channel1");
      const channels = await channelController.getChannels(server._id, "user1");
      expect(channels.length).toBe(1);
    });

    it("A user should not be able to get a channel if he is not in the server", async () => {
      let server = await createServer("server1", "user1");
      await createChannel(server._id, "user1", "channel1", "text", "channel1");
      server = await serverController.getServer(server._id);
      expect(server.channels.length).toBe(1);
      await expect(
        channelController.getChannels(server._id, "user2")
      ).rejects.toThrow(ServerControllerExceptions.UserNotAuthorized);
    });
  });
});

async function createServer(serverName: string, userId: string) {
  const server = await serverController.createServer(
    serverName,
    serverName,
    userId
  );
  return server;
}

async function createChannel(
  serverId: string,
  userId: string,
  channelName: string,
  channelType: string,
  channelDescription: string
) {
  const channel = await channelController.createChannel(
    serverId,
    userId,
    channelName,
    channelType,
    channelDescription
  );
  return channel;
}
