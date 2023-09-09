import mongoose from 'mongoose'
import { ChannelControllerImpl } from '@controllers/channel/channel-controller-impl'
import { ChannelControllerExceptions } from '@controllers/channel/channel-controller'
import { Servers } from '@models/messages-model'
import { ServiceEvents } from '@piperchat/commons/src/events/service-events'
import { RabbitMQ } from '@piperchat/commons/src/rabbit-mq'
import { MongooseUtils } from '@piperchat/commons/src/mongoose-utils'
import { ServerRepositoryImpl } from '@repositories/server/server-repository-impl'
import { ServerRepository } from '@repositories/server/server-repository'
import { MessagesServiceEventsConfiguration } from '@/events-configuration'

const channelController = new ChannelControllerImpl()
const serverRepository: ServerRepository = new ServerRepositoryImpl()

beforeAll(async () => {
  await MongooseUtils.initialize(mongoose, 'mongodb://localhost:27017')
  await RabbitMQ.initialize('amqp://localhost:5672')
  const eventsConfig = new MessagesServiceEventsConfiguration()
  await ServiceEvents.initialize(RabbitMQ.getInstance(), eventsConfig)
})

afterAll(async () => {
  await MongooseUtils.close(mongoose)
  await RabbitMQ.disconnect()
})

afterEach(async () => {
  //await MessageChannels.deleteMany({});
  await Servers.deleteMany({})
})

//channel tests
describe('CREATE operation', () => {
  it('create 4 channel in the server', async () => {
    await serverRepository.addServer('serverId', 'owner')
    await channelController.createChannel('serverId', 'channelType')
    await channelController.createChannel('serverId', 'channelType2')
    await channelController.createChannel('serverId', 'channelType3')
    await channelController.createChannel('serverId', 'channelType4')
    const channels = await channelController.getChannels('serverId')
    expect(channels.length).toBe(4)
  })

  it('should not create channel if server does not exist', async () => {
    await expect(
      channelController.createChannel('serverId', 'channelType')
    ).rejects.toThrow(new ChannelControllerExceptions.ServerNotFound())
  })
})

describe('chat tests', () => {
  it('should send a message', async () => {
    await serverRepository.addServer('serverId', 'owner')
    await channelController.createChannel('serverId', 'channelType')
    const channelId = (await channelController.getChannels('serverId'))[0].id
    await channelController.sendMessage(channelId, 'serverId', 'owner', 'message')
    const messages = await channelController.getChannelMessagesPaginated(
      channelId,
      'serverId',
      0,
      10
    )
    expect(messages.length).toBe(1)
  })
  it('send a lot of messages from different users', async () => {
    await serverRepository.addServer('serverId', 'owner')
    await channelController.createChannel('serverId', 'channelType')
    const channelId = (await channelController.getChannels('serverId'))[0].id
    await channelController.sendMessage(channelId, 'serverId', 'owner', 'message')
    await channelController.sendMessage(channelId, 'serverId', 'owner', 'message2')
    await channelController.sendMessage(channelId, 'serverId', 'owner', 'message3')
    await channelController.sendMessage(channelId, 'serverId', 'owner', 'message4')
    const messages = await channelController.getChannelMessagesPaginated(
      channelId,
      'serverId',
      0,
      10
    )
    expect(messages.length).toBe(4)
  })

  it('should not send a message if the user is not in the server', async () => {
    await serverRepository.addServer('serverId', 'owner')
    await channelController.createChannel('serverId', 'channelType')

    const channelId = (await channelController.getChannels('serverId'))[0].id
    await expect(
      channelController.sendMessage(channelId, 'serverId', 'user', 'message')
    ).rejects.toThrow(new ChannelControllerExceptions.UserNotAuthorized())
  })

  it('should not send a message if the channel does not exist', async () => {
    await serverRepository.addServer('serverId', 'owner')
    await channelController.createChannel('serverId', 'channelType')

    await expect(
      channelController.sendMessage('channelId', 'serverId', 'owner', 'message')
    ).rejects.toThrow(new ChannelControllerExceptions.ChannelNotFound())
  })
})
