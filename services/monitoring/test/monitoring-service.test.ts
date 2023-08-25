import mongoose, { Mongoose } from 'mongoose'
import { RabbitMQ } from '@piperchat/commons'
import { ServiceEvents } from '@events/events'
import { EventLogEntity, ServiceStatusEntity } from '@models/monitoring-model'
import { MonitoringEventRepository } from './repositories/monitoring-event-repository'
import { MonitoringRepository } from '@repositories/monitoring-repository'
import { MonitoringRepositoryImpl } from '@repositories/monitoring-repository-impl'

let monitoringRepository: MonitoringRepository
let monitoringEventRepository: MonitoringEventRepository
const messageEvent = {
  topic: 'messages',
  event: 'message.direct.sent',
  payload: {
    id: '123',
    content: 'Hello World',
  },
}
const serverEvent = {
  topic: 'servers',
  event: 'server.created',
  payload: {
    id: '123',
    name: 'Server 1',
  },
}

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/')

  await RabbitMQ.initialize('amqp://localhost')

  await ServiceEvents.initialize()
})

beforeEach(async () => {
  monitoringRepository = new MonitoringRepositoryImpl()
  monitoringEventRepository = new MonitoringEventRepository()
})

afterEach(async () => {
  await EventLogEntity.deleteMany({})
  await ServiceStatusEntity.deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.close()
  await RabbitMQ.disconnect()
})

describe('Log Service', () => {
  describe('Saving events', () => {
    it('should save an event', async () => {
      await monitoringEventRepository.publishMessageEvent(
        messageEvent.topic,
        messageEvent.event,
        messageEvent.payload
      )
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const events = await EventLogEntity.find({})
      expect(events.length).toBe(1)
    })

    it('should save multiple events', async () => {
      for (let i = 0; i < 3; i++) {
        await monitoringEventRepository.publishMessageEvent(
          messageEvent.topic,
          messageEvent.event,
          messageEvent.payload
        )
      }
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const events = await EventLogEntity.find({})
      expect(events.length).toBe(3)
    })

    it('should save events of different topics', async () => {
      await monitoringEventRepository.publishMessageEvent(
        messageEvent.topic,
        messageEvent.event,
        messageEvent.payload
      )
      await monitoringEventRepository.publishMessageEvent(
        serverEvent.topic,
        serverEvent.event,
        serverEvent.payload
      )
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const events = await EventLogEntity.find({})
      expect(events.length).toBe(2)
    })
  })

  describe('Getting events', () => {
    it('should get events of a topic', async () => {
      await monitoringEventRepository.publishMessageEvent(
        messageEvent.topic,
        messageEvent.event,
        messageEvent.payload
      )
      await monitoringEventRepository.publishMessageEvent(
        serverEvent.topic,
        serverEvent.event,
        serverEvent.payload
      )
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const events = await monitoringRepository.getLogsOfTopic(messageEvent.topic)
      expect(events.length).toBe(1)
    })

    it('should get events of a topic and event', async () => {
      await monitoringEventRepository.publishMessageEvent(
        messageEvent.topic,
        messageEvent.event,
        messageEvent.payload
      )
      await monitoringEventRepository.publishMessageEvent(
        messageEvent.topic,
        'another.event',
        serverEvent.payload
      )
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const events = await monitoringRepository.getLogsOfTopicAndEvent(
        messageEvent.topic,
        messageEvent.event
      )
      expect(events.length).toBe(1)
    })
  })
})

describe('Service Status', () => {
  it('should create a new service status', async () => {
    await monitoringRepository.createServiceStatus('service1', 'online')
    const status = await monitoringRepository.getServiceStatus('service1')
    expect(status.status).toBe('online')
  })

  it('should change the status of a service', async () => {
    await monitoringRepository.createServiceStatus('service1', 'online')
    await monitoringEventRepository.publishNewServiceStatus('service1', 'offline')
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const status = await monitoringRepository.getServiceStatus('service1')
    expect(status.status).toBe('offline')
  })

  it('should get the status of a service', async () => {
    await monitoringRepository.createServiceStatus('service1', 'online')
    const status = await monitoringRepository.getServiceStatus('service1')
    expect(status.status).toBe('online')
  })
})
