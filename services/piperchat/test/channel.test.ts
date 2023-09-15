import supertest from 'supertest'
import { Microservice } from '@commons/service'
import { PiperchatServiceConfiguration } from '@/configuration'
import { generateAccessToken } from '@commons/utils/jwt'

const piperchatMicroservice: Microservice = new Microservice(
  PiperchatServiceConfiguration
)
let request: supertest.SuperTest<supertest.Test>

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

beforeAll(async () => {
  await piperchatMicroservice.start()
  request = supertest(piperchatMicroservice.getServer())
})

afterAll(async () => {
  await piperchatMicroservice.stop()
})

afterEach(async () => {
  await piperchatMicroservice.clearDatabase()
})

async function createServer(
  name: string,
  userToken: string
): Promise<supertest.Response> {
  const response = await request
    .post('/servers')
    .set('Cookie', `jwt=${userToken}`)
    .send({ name, description: name })
  expect(response.status).toBe(200)
  return response
}

async function joinServer(
  serverId: string,
  userToken: string
): Promise<supertest.Response> {
  const response = await request
    .post(`/servers/${serverId}/participants`)
    .set('Cookie', `jwt=${userToken}`)
  expect(response.status).toBe(200)
  return response
}

async function createChannel(
  serverId: string,
  userToken: string,
  name: string,
  channelType: string
): Promise<supertest.Response> {
  const response = await request
    .post(`/servers/${serverId}/channels`)
    .set('Cookie', `jwt=${userToken}`)
    .send({ name, channelType })
  expect(response.status).toBe(200)
  return response
}

describe('Get channels', () => {
  it('A user should not be able to get channels of a server if he is not in the server', async () => {
    const serverResponse = await createServer('test', jwt1)
    const serverId = serverResponse.body.serverId
    const response = await request
      .get(`/servers/${serverId}/channels`)
      .set('Cookie', `jwt=${jwt2}`)
    expect(response.status).toBe(403)
  })

  it('A user should be able to get channels of a server if he is the owner', async () => {
    const serverResponse = await createServer('test', jwt1)
    const serverId = serverResponse.body.serverId
    const response = await request
      .get(`/servers/${serverId}/channels`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
  })

  it('A user should be able to get channels of a server if he is in the server', async () => {
    const serverResponse = await createServer('test', jwt1)
    const serverId = serverResponse.body.serverId
    await joinServer(serverId, jwt2)
    const response = await request
      .get(`/servers/${serverId}/channels`)
      .set('Cookie', `jwt=${jwt2}`)
    expect(response.status).toBe(200)
  })

  it('A user should not be able to get channels of a server if the server does not exist', async () => {
    const response = await request
      .get(`/servers/123/channels`)
      .set('Cookie', `jwt=${jwt2}`)
    expect(response.status).toBe(404)
  })
})

describe('Create channel', () => {
  it('A user should provide a name and a valid channel type', async () => {
    const serverResponse = await createServer('test', jwt1)
    const serverId = serverResponse.body.serverId
    const response = await request
      .post(`/servers/${serverId}/channels`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'test', channelType: 'messages' })
    expect(response.status).toBe(200)
    const mediaResponse = await request
      .post(`/servers/${serverId}/channels`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'test2', channelType: 'multimedia' })
    expect(mediaResponse.status).toBe(200)
  })

  it('A user should not be able to create two channel with same name in a server', async () => {
    const serverResponse = await createServer('test', jwt1)
    const serverId = serverResponse.body.serverId
    const response = await request
      .post(`/servers/${serverId}/channels`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'test', channelType: 'messages' })
    expect(response.status).toBe(200)
    const response2 = await request
      .post(`/servers/${serverId}/channels`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'test', channelType: 'messages' })
    expect(response2.status).toBe(409)
  })

  it('A user should not be able to create a channel if he is not in the server', async () => {
    const serverResponse = await createServer('test', jwt1)
    const serverId = serverResponse.body.serverId
    const response = await request
      .post(`/servers/${serverId}/channels`)
      .set('Cookie', `jwt=${jwt2}`)
      .send({ name: 'test', channelType: 'messages' })
    expect(response.status).toBe(403)
  })

  it('A user should not be able to create a channel if the server does not exist', async () => {
    const response = await request
      .post(`/servers/123/channels`)
      .set('Cookie', `jwt=${jwt2}`)
      .send({ name: 'test', channelType: 'messages' })
    expect(response.status).toBe(404)
  })

  it('A user should not be able to create a channel if the channel type is invalid', async () => {
    const serverResponse = await createServer('test', jwt1)
    const serverId = serverResponse.body.serverId
    const response = await request
      .post(`/servers/${serverId}/channels`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'test', channelType: 'invalid' })
    expect(response.status).toBe(400)
  })
})

describe('Get channel', () => {
  it('A user should not be able to get a channel of a server if he is not in the server', async () => {
    const serverResponse = await createServer('test', jwt1)
    const serverId = serverResponse.body.serverId
    const response = await request
      .get(`/servers/${serverId}/channels/123`)
      .set('Cookie', `jwt=${jwt2}`)
    expect(response.status).toBe(403)
  })

  it('A user should be able to get a channel of a server if he is the owner', async () => {
    const serverResponse = await createServer('test', jwt1)
    const serverId = serverResponse.body.serverId
    const channelResponse = await createChannel(serverId, jwt1, 'test', 'messages')
    const channelId = channelResponse.body.channel.id
    const response = await request
      .get(`/servers/${serverId}/channels/${channelId}`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
  })

  it('A user should be able to get a channel of a server if he is in the server', async () => {
    const serverResponse = await createServer('test', jwt1)
    const serverId = serverResponse.body.serverId
    const createChannelResponse = await createChannel(serverId, jwt1, 'test', 'messages')
    const channelId = createChannelResponse.body.channel.id
    await joinServer(serverId, jwt2)
    const response = await request
      .get(`/servers/${serverId}/channels/${channelId}`)
      .set('Cookie', `jwt=${jwt2}`)
    expect(response.status).toBe(200)
    expect(response.body.channel.name).toBe('test')
  })
})
