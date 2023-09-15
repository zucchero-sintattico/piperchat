import supertest from 'supertest'
import { Microservice } from '@commons/service'
import { MessagesServiceConfiguration } from '@/configuration'
import { generateAccessToken } from '@commons/utils/jwt'
import { ServerRepository } from '@/repositories/server/server-repository'
import { ServerRepositoryImpl } from '@/repositories/server/server-repository-impl'

const messagesMicroservice: Microservice = new Microservice(MessagesServiceConfiguration)
let serverRepository: ServerRepository

let request: supertest.SuperTest<supertest.Test>

beforeAll(async () => {
  await messagesMicroservice.start()
  request = supertest(messagesMicroservice.getServer())
  serverRepository = new ServerRepositoryImpl()
})

afterAll(async () => {
  await messagesMicroservice.stop()
})

afterEach(async () => {
  await messagesMicroservice.clearDatabase()
})

const user1 = {
  username: 'test1',
  email: 'test1',
  password: 'test1',
}
const jwt1 = generateAccessToken(user1)

const user2 = {
  username: 'test2',
  email: 'test2',
  password: 'test2',
}

const jwt2 = generateAccessToken(user2)

async function createServer(owner: string): Promise<string> {
  await serverRepository.addServer('serverId', owner)
  return 'serverId'
}

async function createChannel(serverId: string): Promise<string> {
  await serverRepository.addMessageChannel(serverId, 'channelId')
  return 'channelId'
}

async function addParticipant(serverId: string, participantId: string): Promise<void> {
  await serverRepository.addParticipant(serverId, participantId)
}

describe('Send channel message', () => {
  it('A user should be able to send a channel message', async () => {
    const serverId = await createServer(user1.username)
    const channelId = await createChannel(serverId)
    const response = await request
      .post(`/servers/${serverId}/channels/${channelId}/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ content: 'test' })
    expect(response.status).toBe(200)
  })

  it('A user should not be able to send a channel message if the server does not exist', async () => {
    const response = await request
      .post(`/servers/invalid/channels/invalid/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ content: 'test' })
    expect(response.status).toBe(404)
  })

  it('A user should not be able to send a channel message if the channel does not exist', async () => {
    const serverId = await createServer(user1.username)
    const response = await request
      .post(`/servers/${serverId}/channels/invalid/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ content: 'test' })
    expect(response.status).toBe(404)
  })

  it('A user should not be able to send a channel message if the user is not authenticated', async () => {
    const serverId = await createServer(user1.username)
    const channelId = await createChannel(serverId)
    const response = await request
      .post(`/servers/${serverId}/channels/${channelId}/messages`)
      .send({ content: 'test' })
    expect(response.status).toBe(401)
  })

  it('A user should not be able to send a channel message if the user is not a participant of the server', async () => {
    const serverId = await createServer(user1.username)
    const channelId = await createChannel(serverId)
    const response = await request
      .post(`/servers/${serverId}/channels/${channelId}/messages`)
      .set('Cookie', `jwt=${jwt2}`)
      .send({ content: 'test' })
    expect(response.status).toBe(401)
    await addParticipant(serverId, user2.username)
    const response2 = await request
      .post(`/servers/${serverId}/channels/${channelId}/messages`)
      .set('Cookie', `jwt=${jwt2}`)
      .send({ content: 'test' })
    expect(response2.status).toBe(200)
  })
})

describe('Get channel messages', () => {
  it('A user should be able to get channel messages', async () => {
    const serverId = await createServer(user1.username)
    const channelId = await createChannel(serverId)
    await request
      .post(`/servers/${serverId}/channels/${channelId}/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ content: 'test' })
    const response = await request
      .get(`/servers/${serverId}/channels/${channelId}/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .query({ from: 0, limit: 1 })
    expect(response.status).toBe(200)
    expect(response.body.messages.length).toBe(1)
    expect(response.body.messages[0].content).toBe('test')
    expect(response.body.messages[0].sender).toBe(user1.username)
  })

  it('A user should not be able to get channel messages if he is not logged in', async () => {
    const serverId = await createServer(user1.username)
    const channelId = await createChannel(serverId)
    await request
      .post(`/servers/${serverId}/channels/${channelId}/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ content: 'test' })
    const response = await request
      .get(`/servers/${serverId}/channels/${channelId}/messages`)
      .query({ from: 0, limit: 1 })
    expect(response.status).toBe(401)
  })

  it('A user should not be able to get channel messages if the server does not exist', async () => {
    const response = await request
      .get(`/servers/invalid/channels/invalid/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .query({ from: 0, limit: 1 })
    expect(response.status).toBe(404)
  })

  it('A user should not be able to get channel messages if the channel does not exist', async () => {
    const serverId = await createServer(user1.username)
    const response = await request
      .get(`/servers/${serverId}/channels/invalid/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .query({ from: 0, limit: 1 })
    expect(response.status).toBe(404)
  })

  it('A user should not be able to get channel messages if the user is not authenticated', async () => {
    const serverId = await createServer(user1.username)
    const channelId = await createChannel(serverId)
    const response = await request
      .get(`/servers/${serverId}/channels/${channelId}/messages`)
      .query({ from: 0, limit: 1 })
    expect(response.status).toBe(401)
  })

  it('A user should not be able to get channel messages if the user is not a participant of the server', async () => {
    const serverId = await createServer(user1.username)
    const channelId = await createChannel(serverId)
    const response = await request
      .get(`/servers/${serverId}/channels/${channelId}/messages`)
      .set('Cookie', `jwt=${jwt2}`)
      .query({ from: 0, limit: 1 })
    expect(response.status).toBe(401)
    await addParticipant(serverId, user2.username)
    const response2 = await request
      .get(`/servers/${serverId}/channels/${channelId}/messages`)
      .set('Cookie', `jwt=${jwt2}`)
      .query({ from: 0, limit: 1 })
    expect(response2.status).toBe(200)
  })
})
