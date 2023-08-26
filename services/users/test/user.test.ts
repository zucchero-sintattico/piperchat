import supertest from 'supertest'
import { UsersServer } from '@/server'
import { UserApi } from './api/user-api'
import { RabbitMQ, MongooseUtils } from '@piperchat/commons'
import { ServiceEvents } from '@events/events'
import mongoose from 'mongoose'

let server: UsersServer

let userApi: UserApi

beforeAll(async () => {
  const port = Number.parseInt(process.env['PORT']!) || 3000
  const amqpUri = process.env['AMQP_URI'] || 'amqp://localhost:5672'
  const mongoUri = process.env['MONGO_URI'] || 'mongodb://localhost:27017'

  server = new UsersServer(port)

  // Initialize mongoose
  await MongooseUtils.initialize(mongoose, mongoUri)

  // Initialize RabbitMQ
  await RabbitMQ.initialize(amqpUri)

  // Initialize service events listeners
  await ServiceEvents.initialize()
  await server.start()
  userApi = new UserApi(supertest(server.server))
})

beforeEach(async () => {
  let response = await userApi.register('test0', 'test0', 'test0')
  expect(response.status).toBe(200)
  response = await userApi.register('test1', 'test1', 'test1')
  expect(response.status).toBe(200)
})

afterAll(async () => {
  server.stop()
  await MongooseUtils.close(mongoose)
  await RabbitMQ.disconnect()
})

afterEach(async () => {
  await MongooseUtils.clear(mongoose)
})

describe('User authentication', () => {
  it('A user must provide username, password and email', async () => {
    const response = await userApi.register('', '', '')
    console.log(response)
    expect(response.status).toBe(400)
  })

  it('A new user should be able to register only once', async () => {
    const response = await userApi.register('test0', 'test0', 'test0')
    expect(response.status).toBe(409)
  })

  it('A user should be able to login after register', async () => {
    const response = await userApi.login('test0', 'test0')
    expect(response.status).toBe(200)
    expect(response.header['set-cookie']).toHaveLength(1)
  })

  it('A user should be able to ask who he is', async () => {
    await userApi.login('test0', 'test0')
    const response = await userApi.whoami()
    expect(response.status).toBe(200)
    expect(response.body.user.username).toBe('test0')
  })

  it('A user should be able to logout', async () => {
    await userApi.login('test0', 'test0')
    const response = await userApi.logout()
    expect(response.status).toBe(200)
    expect(response.header['set-cookie'][0]).toContain('jwt=; Path=/; Expires=')
  })
})

describe('User info', () => {
  it('A user should be able to get his description', async () => {
    await userApi.login('test0', 'test0')
    const response = await userApi.getDescription('test0')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('description')
  })

  it('A user should be able to update his description', async () => {
    await userApi.login('test0', 'test0')
    const newDescription = "I'm an awesome user"
    let response = await userApi.updateDescription(newDescription)
    expect(response.status).toBe(200)

    response = await userApi.getDescription('test0')
    expect(response.body.description).toBe(newDescription)
  })

  it('A user should be able to get other description', async () => {
    await userApi.login('test0', 'test0')
    const newDescription = "I'm an awesome user"
    let response = await userApi.updateDescription(newDescription)
    expect(response.status).toBe(200)

    await userApi.login('test1', 'test1')
    response = await userApi.getDescription('test0')
    expect(response.body.description).toBe(newDescription)
  })
})

describe('Friend request', () => {
  it('A new user should have empty friend list', async () => {
    await userApi.login('test0', 'test0')
    const response = await userApi.getAllFriends()
    expect(response.status).toBe(200)
    expect(response.body.friends).toHaveLength(0)
  })

  it('Two users should become friends', async () => {
    await userApi.login('test0', 'test0')
    let response = await userApi.sendFriendRequest('test1')
    expect(response.status).toBe(200)

    await userApi.login('test1', 'test1')
    await userApi.acceptFriendRequest('test0')
    response = await userApi.getAllFriends()
    expect(response.body.friends).toContain('test0')

    await userApi.login('test0', 'test0')
    response = await userApi.getAllFriends()
    expect(response.body.friends).toContain('test1')
  })

  it('A user should be able to reject a friend request', async () => {
    await userApi.login('test0', 'test0')
    await userApi.sendFriendRequest('test1')

    await userApi.login('test1', 'test1')
    await userApi.denyFriendRequest('test0')

    await userApi.login('test0', 'test0')
    const response = await userApi.getAllFriends()
    expect(response.body.friends).toHaveLength(0)
  })
})
