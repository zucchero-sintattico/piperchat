import mongoose from 'mongoose'
import { Servers } from '@models/messages-model'
import { ServerRepositoryImpl } from '@repositories/server/server-repository-impl'
import { ServerRepository } from '@repositories/server/server-repository'
import { RabbitMQ } from '@piperchat/commons/src/rabbit-mq'
import { MongooseUtils } from '@piperchat/commons/src/mongoose-utils'
import { MessagesServiceEventsConfiguration } from '@/events-configuration'
import { ServiceEvents } from '@piperchat/commons/src/events/service-events'

const serverRepository: ServerRepository = new ServerRepositoryImpl()

beforeAll(async () => {
  await MongooseUtils.initialize(mongoose, 'mongodb://localhost:27017')
  await RabbitMQ.initialize('amqp://localhost')

  const eventsConfig = new MessagesServiceEventsConfiguration()
  await ServiceEvents.initialize(RabbitMQ.getInstance(), eventsConfig)
})

afterAll(async () => {
  await MongooseUtils.close(mongoose)
  await RabbitMQ.disconnect()
})

afterEach(async () => {
  await Servers.deleteMany({})
})

//server tests
describe('CREATE operation', () => {
  it('basic create', async () => {
    await serverRepository.addServer('serverId', 'partecipantId')
    const servers = await serverRepository.getServerPartecipants('serverId')
    expect(servers.length).toBe(1)
    expect(servers[0]).toBe('partecipantId')
  })
})

describe('GET operation', () => {
  it("it should return an error if server doesn't exists", async () => {
    await expect(serverRepository.getServerPartecipants('serverId')).rejects.toThrow(
      new Error('Server not found')
    )
  })
  it('should return a server if it exists', async () => {
    await serverRepository.addServer('serverId', 'partecipantId')
    const servers = await serverRepository.getServerPartecipants('serverId')
    expect(servers.length).toBe(1)
    expect(servers[0]).toBe('partecipantId')
  })
})

describe('Partecipant operations', () => {
  it('should add a partecipant to a server', async () => {
    await serverRepository.addServer('serverId', 'partecipantId')
    await serverRepository.addPartecipant('serverId', 'partecipantId2')
    const servers = await serverRepository.getServerPartecipants('serverId')
    expect(servers.length).toBe(2)
    expect(servers[0]).toBe('partecipantId')
    expect(servers[1]).toBe('partecipantId2')
  })
  it('should remove a partecipant from a server', async () => {
    await serverRepository.addServer('serverId', 'partecipantId')
    await serverRepository.addPartecipant('serverId', 'partecipantId2')
    await serverRepository.removePartecipant('serverId', 'partecipantId2')
    const servers = await serverRepository.getServerPartecipants('serverId')
    expect(servers.length).toBe(1)
    expect(servers[0]).toBe('partecipantId')
  })
  it("should return an error if server doesn't exists in remove operation", async () => {
    await serverRepository.addServer('serverId', 'partecipantId')
    await expect(
      serverRepository.removePartecipant('serverId2', 'partecipantId')
    ).rejects.toThrow(Error)
  })
})
