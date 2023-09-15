import supertest from 'supertest'
import { Microservice } from '@commons/service'
import { MessagesServiceConfiguration } from '@/configuration'
import { DirectRepository } from '@/repositories/direct/direct-repository'
import { DirectRepositoryImpl } from '@/repositories/direct/direct-repository-impl'
import { generateAccessToken } from '@commons/utils/jwt'

const messagesMicroservice: Microservice = new Microservice(MessagesServiceConfiguration)
let directRepository: DirectRepository

let request: supertest.SuperTest<supertest.Test>

beforeAll(async () => {
  await messagesMicroservice.start()
  request = supertest(messagesMicroservice.getServer())
  directRepository = new DirectRepositoryImpl()
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

async function createDirect(first: string, second: string) {
  await directRepository.createDirect(first, second)
}

describe('Send direct message', () => {
  it('A user should be able to send a direct message', async () => {
    await createDirect(user1.username, user2.username)
    const response = await request
      .post(`/users/${user2.username}/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ message: 'test' })
    expect(response.status).toBe(200)
  })

  it('A user should not be able to send a direct message if the user does not exist', async () => {
    const response = await request
      .post(`/users/invalid/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ message: 'test' })
    expect(response.status).toBe(404)
  })

  it('A user should not be able to send a direct message if the user is not authenticated', async () => {
    const response = await request
      .post(`/users/${user2.username}/messages`)
      .send({ message: 'test' })
    expect(response.status).toBe(401)
  })

  it('A user should not be able to send a direct message to himself', async () => {
    await createDirect(user1.username, user2.username)
    const response = await request
      .post(`/users/${user2.username}/messages`)
      .set('Cookie', `jwt=${jwt2}`)
      .send({ message: 'test' })
    expect(response.status).toBe(400)
  })

  it('A user should not be able to send a direct message if the direct does not exist', async () => {
    const response = await request
      .post(`/users/${user2.username}/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ message: 'test' })
    expect(response.status).toBe(404)
  })
})

describe('Get direct messages', () => {
  it('A user should be able to get direct messages', async () => {
    await createDirect(user1.username, user2.username)
    await request
      .post(`/users/${user2.username}/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .send({ message: 'test' })
    const response = await request
      .get(`/users/${user2.username}/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .query({ from: 0, limit: 1 })
    expect(response.status).toBe(200)
    expect(response.body.messages.length).toBe(1)
    expect(response.body.messages[0].content).toBe('test')
    expect(response.body.messages[0].sender).toBe(user1.username)
  })

  it('A user should not be able to get direct messages if the user does not exist', async () => {
    const response = await request
      .get(`/users/invalid/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .query({ from: 0, limit: 1 })
    expect(response.status).toBe(404)
  })

  it('A user should not be able to get direct messages if the user is not authenticated', async () => {
    const response = await request
      .get(`/users/${user2.username}/messages`)
      .query({ from: 0, limit: 1 })
    expect(response.status).toBe(401)
  })

  it('A user should not be able to get direct messages if the direct does not exist', async () => {
    const response = await request
      .get(`/users/${user2.username}/messages`)
      .set('Cookie', `jwt=${jwt1}`)
      .query({ from: 0, limit: 1 })
    expect(response.status).toBe(404)
  })
})
