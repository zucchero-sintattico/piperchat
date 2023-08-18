import mongoose, { Mongoose } from "mongoose";
import { DirectControllerImpl } from "../src/controllers/direct/direct-controller-impl";
import { Directs } from "../src/models/messages-model";
import { RabbitMQ } from "../src/utils/rabbit-mq";
import { ServiceEvents } from "../src/events/events";

let directController = new DirectControllerImpl();

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/");
  await RabbitMQ.initialize("amqp://localhost");
  await ServiceEvents.initialize();
});

afterAll(async () => {
  await mongoose.connection.close();
  await RabbitMQ.disconnect();
});

afterEach(async () => {
  await Directs.deleteMany({});
});

test("read a empty direct", async () => {
  const messages = await directController.getDirectMessagesPaginated(
    "username1",
    "username2",
    0,
    10
  );
  expect(messages.length).toBe(0);
});

//send a direct message and check if it is saved

test("send a direct message", async () => {
  await directController.sendDirectMessage("username1", "username2", "message");
  const messages = await directController.getDirectMessagesPaginated(
    "username1",
    "username2",
    0,
    10
  );
  expect(messages.length).toBe(1);
  expect(messages[0].content).toBe("message");
  expect(messages[0].sender).toBe("username1");
});

//check if the direct between two username1 and username2 is the same between username2 and username1
test("check if the direct between two username1 and username2 is the same between username2 and username1", async () => {
  await directController.sendDirectMessage("username1", "username2", "message");
  const messages = await directController.getDirectMessagesPaginated(
    "username2",
    "username1",
    0,
    10
  );
  expect(messages.length).toBe(1);
  expect(messages[0].content).toBe("message");
  expect(messages[0].sender).toBe("username1");
});

//pagination test, send 10 messages and check if the pagination works
test("pagination test, send 10 messages and check if the pagination works", async () => {
  for (let i = 0; i < 10; i++) {
    await directController.sendDirectMessage(
      "username1",
      "username2",
      "message" + i
    );
  }
  const messages = await directController.getDirectMessagesPaginated(
    "username1",
    "username2",
    0,
    5
  );
  expect(messages.length).toBe(5);
  expect(messages[0].content).toBe("message0");
  expect(messages[4].content).toBe("message4");
  const messages2 = await directController.getDirectMessagesPaginated(
    "username1",
    "username2",
    5,
    5
  );
  expect(messages2.length).toBe(5);
  expect(messages2[0].content).toBe("message5");
  expect(messages2[4].content).toBe("message9");
});
