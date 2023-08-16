import mongoose, { Mongoose } from "mongoose";
import { RabbitMQ } from "@piperchat/commons";
import { ServiceEvents } from "../src/events/events";
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

  await RabbitMQ.initialize("amqp://localhost");

  await ServiceEvents.initialize();
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
  await RabbitMQ.disconnect();
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

    it("A user should not be able to get a channel if the server does not exist", async () => {
      await expect(
        channelController.getChannels("123", "user1")
      ).rejects.toThrow(ServerControllerExceptions.ServerNotFound);
    });
  });

  describe("Create", () => {
    it("A user should be able to create a channel if he is the owner of the server", async () => {
      let server = await createServer("server1", "user1");
      const channel = await createChannel(
        server._id,
        "user1",
        "channel1",
        "text",
        "channel1"
      );
      server = await serverController.getServer(server._id);
      expect(server.channels.length).toBe(1);
    });

    it("A user should not be able to create a channel if he is not the owner of the server", async () => {
      const server = await createServer("server1", "user1");
      await expect(
        createChannel(server._id, "user2", "channel1", "text", "channel1")
      ).rejects.toThrow(ServerControllerExceptions.UserNotAuthorized);
    });

    it("A user should not be able to create a channel if the server does not exist", async () => {
      await expect(
        createChannel("123", "user1", "channel1", "text", "channel1")
      ).rejects.toThrow(ServerControllerExceptions.ServerNotFound);
    });
  });

  describe("Update", () => {
    it("A user should be able to update a channel if he is the owner of the server", async () => {
      let server = await createServer("server1", "user1");
      const channel = await createChannel(
        server._id,
        "user1",
        "channel1",
        "text",
        "channel1"
      );
      server = await serverController.getServer(server._id);

      expect(channel.name).toBe("channel1");
      const updatedChannel = await channelController.updateChannel(
        server._id,
        channel._id,
        "user1",
        "channel2",
        "channel2"
      );
      expect(updatedChannel.name).toBe("channel2");
    });

    it("A user should not be able to update a channel if he is not the owner of the server", async () => {
      let server = await createServer("server1", "user1");
      const channel = await createChannel(
        server._id,
        "user1",
        "channel1",
        "text",
        "channel1"
      );
      await expect(
        channelController.updateChannel(
          server._id,
          channel._id,
          "user2",
          "channel2",
          "channel2"
        )
      ).rejects.toThrow(ServerControllerExceptions.UserNotAuthorized);
    });

    it("A user should not be able to update a channel if the server does not exist", async () => {
      await expect(
        channelController.updateChannel(
          "123",
          "123",
          "user1",
          "channel2",
          "channel2"
        )
      ).rejects.toThrow(ServerControllerExceptions.ServerNotFound);
    });

    it("A user should not be able to update a channel if the channel does not exist", async () => {
      let server = await createServer("server1", "user1");
      await expect(
        channelController.updateChannel(
          server._id,
          "123",
          "user1",
          "channel2",
          "channel2"
        )
      ).rejects.toThrow(ChannelControllerExceptions.ChannelNotFound);
    });

    it("A user should not be able to update a channel if he choose a name of another channel", async () => {
      let server = await createServer("server1", "user1");
      const channel1 = await createChannel(
        server._id,
        "user1",
        "channel1",
        "text",
        "channel1"
      );
      const channel2 = await createChannel(
        server._id,
        "user1",
        "channel2",
        "text",
        "channel2"
      );
      await expect(
        channelController.updateChannel(
          server._id,
          channel1._id,
          "user1",
          "channel2",
          "channel2"
        )
      ).rejects.toThrow(ChannelControllerExceptions.ChannelAlreadyExists);
    });
  });

  describe("Delete", () => {
    it("A user should be able to delete a channel if he is the owner of the server", async () => {
      let server = await createServer("server1", "user1");
      const channel = await createChannel(
        server._id,
        "user1",
        "channel1",
        "text",
        "channel1"
      );
      server = await serverController.getServer(server._id);
      expect(server.channels.length).toBe(1);
      await channelController.deleteChannel(server._id, channel._id, "user1");
      server = await serverController.getServer(server._id);
      expect(server.channels.length).toBe(0);
    });

    it("A user should not be able to delete a channel if he is not the owner of the server", async () => {
      let server = await createServer("server1", "user1");
      const channel = await createChannel(
        server._id,
        "user1",
        "channel1",
        "text",
        "channel1"
      );
      server = await serverController.getServer(server._id);
      expect(server.channels.length).toBe(1);
      await expect(
        channelController.deleteChannel(server._id, channel._id, "user2")
      ).rejects.toThrow(ServerControllerExceptions.UserNotAuthorized);
    });

    it("A user should not be able to delete a channel if the server does not exist", async () => {
      await expect(
        channelController.deleteChannel("123", "123", "user1")
      ).rejects.toThrow(ServerControllerExceptions.ServerNotFound);
    });

    it("A user should not be able to delete a channel if the channel does not exist", async () => {
      let server = await createServer("server1", "user1");
      await expect(
        channelController.deleteChannel(server._id, "123", "user1")
      ).rejects.toThrow(ChannelControllerExceptions.ChannelNotFound);
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
