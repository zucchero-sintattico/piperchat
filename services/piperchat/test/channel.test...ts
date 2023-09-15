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

async function createServer(name: string): Promise<Response> {
  const response = await request
    .post('/servers')
    .set('Cookie', `jwt=${jwt1}`)
    .send({ name, description: name })
  expect(response.status).toBe(200)
  return response
}

describe('Get channels', () => {
  it('A user should be able to get his channels', async () => {
    let response = await createServer('server1')
    const serverId = response.body.serverId
    response = await request
      .get(`/servers/${serverId}/channels`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.channels).toEqual([])
  })

  it('A user should not be able to get his channels if he is not logged in', async () => {
    let response = await createServer('server1')
    const serverId = response.body.serverId
    response = await request.get(`/servers/${serverId}/channels`)
    expect(response.status).toBe(401)
  })

  it('A user that is not in the server should not be able to get the channels', async () => {
    let response = await createServer('server1')
    console.log('BODY = ', response.body)
    const serverId = response.body.serverId
    response = await request
      .get(`/servers/${serverId}/channels`)
      .set('Cookie', `jwt=${jwt2}`)
    expect(response.status).toBe(403)
  })

  it('A user should not be able to get the channels if the server does not exist', async () => {
    const response = await request
      .get(`/servers/123/channels`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(404)
  })
})
