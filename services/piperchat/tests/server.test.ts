import mongoose, { Mongoose } from "mongoose";
import {
  ServerController,
  ServerControllerExceptions,
} from "../src/controllers/server/server-controller";
import { ServerControllerImpl } from "../src/controllers/server/server-controller-impl";
import { Servers } from "../src/models/server-model";

let controller: ServerController;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/");
  // // fill database with data
  // await Servers.create({
  //   name: "server1",
  //   description: "server1",
  //   owner: "user1",
  //   participants: ["user1", "user2"],
  //   channels: [],
  // });
});

beforeEach(async () => {
  controller = new ServerControllerImpl();
});

afterEach(async () => {
  await Servers.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User", () => {
  it("A new user should not be is any servers", async () => {
    await expect(controller.getServers("user")).rejects.toThrow(
      ServerControllerExceptions.UserNotFound
    );
  });

  it("A new user should be able to create a server", async () => {
    await controller.createServer("server1", "server1", "user1");
    const servers = await controller.getServers("user1");
    expect(servers.length).toBe(1);
  });

  // check if getServerById works
  it("A user should be able to get a server by its id", async () => {
    const server = await controller.createServer("server1", "server1", "user1");
    const serverById = await controller.getServer(server._id);
    expect(serverById._id.toString).toBe(server._id.toString);
  });
});
