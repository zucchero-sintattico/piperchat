import { RabbitMQ, MongooseUtils } from '@piperchat/commons'
import mongoose from 'mongoose'
import { ServiceEvents } from '@events/events'
import {
  UserStatusRepository,
  UserStatusRepositoryImpl,
} from '@repositories/user-status-repository'

let userStatusRepository: UserStatusRepository
const amqpUri = process.env.AMQP_URI || 'amqp://localhost'
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017'

beforeAll(async () => {
  // Initialize mongoose
  await MongooseUtils.initialize(mongoose, mongoUri)

  // Initialize RabbitMQ
  await RabbitMQ.initialize(amqpUri)

  // Initialize service events listeners
  await ServiceEvents.initialize()

  // Initialize repositories
  userStatusRepository = new UserStatusRepositoryImpl()
})

afterAll(async () => {
  await MongooseUtils.close(mongoose)
  await RabbitMQ.disconnect()
})

describe('Online status', () => {
  it('A user should change his status from online to offline', async () => {
    await userStatusRepository.setOnline('user1')
    let user = await userStatusRepository.getUser('user1')
    expect(user.status).toBe('online')

    await userStatusRepository.setOffline('user1')
    user = await userStatusRepository.getUser('user1')
    expect(user.status).toBe('offline')
  })
})
