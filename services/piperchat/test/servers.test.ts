import supertest, { Response } from 'supertest'
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

describe('Get servers', () => {
  it('A user should be able to get his servers', async () => {
    const response = await request.get('/servers').set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.servers).toEqual([])
  })

  it('A user should not be able to get his servers if he is not logged in', async () => {
    const response = await request.get('/servers')
    expect(response.status).toBe(401)
  })
})

describe('Create server', () => {
  it('A user should be able to create a server', async () => {
    const response = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'server1', description: 'server1' })
    expect(response.status).toBe(200)
    expect(response.body.serverId).toBeDefined()
  })

  it('A user should not be able to create a server if he is not logged in', async () => {
    const response = await request
      .post('/servers')
      .send({ name: 'server1', description: 'server1' })
    expect(response.status).toBe(401)
  })

  it('A user should not be able to create a server if the name is not provided', async () => {
    const response = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ description: 'server1' })
    expect(response.status).toBe(400)
  })

  it('A user should not be able to create a server if the description is not provided', async () => {
    const response = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'server1' })
    expect(response.status).toBe(400)
  })
})

describe('Delete server', () => {
  it('A user should be able to delete a server if he is the owner', async () => {
    const createServerResponse = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'server1', description: 'server1' })
    const serverId = createServerResponse.body.serverId
    const deleteServerResponse = await request
      .delete(`/servers/${serverId}`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(deleteServerResponse.status).toBe(200)
  })

  it('A user should not be able to delete a server if he is not the owner', async () => {
    const createServerResponse = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'server1', description: 'server1' })
    const serverId = createServerResponse.body.serverId
    const deleteServerResponse = await request
      .delete(`/servers/${serverId}`)
      .set('Cookie', `jwt=${jwt2}`)
    expect(deleteServerResponse.status).toBe(403)
  })

  it('A user should not be able to delete a server if he is not logged in', async () => {
    const createServerResponse = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'server1', description: 'server1' })
    const serverId = createServerResponse.body.serverId
    const deleteServerResponse = await request.delete(`/servers/${serverId}`)
    expect(deleteServerResponse.status).toBe(401)
  })

  it('A user should not be able to delete a server if the server does not exist', async () => {
    const deleteServerResponse = await request
      .delete(`/servers/123`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(deleteServerResponse.status).toBe(404)
  })
})

describe('Update server', () => {
  it('A user should be able to update a server if he is the owner', async () => {
    const createServerResponse = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'server1', description: 'server1' })
    const serverId = createServerResponse.body.serverId
    const updateServerResponse = await request
      .put(`/servers/${serverId}`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'server2', description: 'server2' })
    expect(updateServerResponse.status).toBe(200)
  })

  it('A user should not be able to update a server if he is not the owner', async () => {
    const createServerResponse = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'server1', description: 'server1' })
    const serverId = createServerResponse.body.serverId
    const updateServerResponse = await request
      .put(`/servers/${serverId}`)
      .set('Cookie', `jwt=${jwt2}`)
      .send({ name: 'server2', description: 'server2' })
    expect(updateServerResponse.status).toBe(403)
  })

  it('A user should not be able to update a server if he is not logged in', async () => {
    const createServerResponse = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'server1', description: 'server1' })
    const serverId = createServerResponse.body.serverId
    const updateServerResponse = await request
      .put(`/servers/${serverId}`)
      .send({ name: 'server2', description: 'server2' })
    expect(updateServerResponse.status).toBe(401)
  })

  it('A user should not be able to update a server if the server does not exist', async () => {
    const updateServerResponse = await request
      .put(`/servers/123`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'server2', description: 'server2' })
    expect(updateServerResponse.status).toBe(404)
  })
})

describe('Get server', () => {
  it('A user should be able to get a server if he is a participant', async () => {
    const createServerResponse = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ name: 'server1', description: 'server1' })
    const serverId = createServerResponse.body.serverId
    const getServerResponse = await request
      .get(`/servers/${serverId}`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(getServerResponse.status).toBe(200)
  })

  it('A user should not be able to get a server if he is not a participant', async () => {
    const createServerResponse = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt2}`)
      .send({ name: 'server1', description: 'server1' })
    const serverId = createServerResponse.body.serverId
    const getServerResponse = await request
      .get(`/servers/${serverId}`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(getServerResponse.status).toBe(403)
  })

  it('A user should not be able to get a server if he is not logged in', async () => {
    const createServerResponse = await request
      .post('/servers')
      .set('Cookie', `jwt=${jwt2}`)
      .send({ name: 'server1', description: 'server1' })
    const serverId = createServerResponse.body.serverId
    const getServerResponse = await request.get(`/servers/${serverId}`)
    expect(getServerResponse.status).toBe(401)
  })

  it('A user should not be able to get a server if the server does not exist', async () => {
    const getServerResponse = await request
      .get(`/servers/123`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(getServerResponse.status).toBe(404)
  })
})
