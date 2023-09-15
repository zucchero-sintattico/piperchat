import supertest from 'supertest'
import { Microservice } from '@commons/service'
import { UserServiceConfiguration } from '@/configuration'
import { generateAccessToken } from '@commons/utils/jwt'

const userMicroservice: Microservice = new Microservice(UserServiceConfiguration)
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

beforeAll(async () => {
  await userMicroservice.start()
  request = supertest(userMicroservice.getServer())
})

afterAll(async () => {
  await userMicroservice.stop()
})

afterEach(async () => {
  await userMicroservice.clearDatabase()
})

beforeEach(async () => {
  await request.post('/auth/register').send(user1)
  await request.post('/auth/register').send(user2)
})

describe('Get user photo', () => {
  it('A user should be able to get a user photo', async () => {
    const response = await request
      .get(`/users/${user1.username}/photo`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.photo).toBeUndefined()
  })

  it('A user should not be able to get a user photo if the user does not exist', async () => {
    const response = await request
      .get(`/users/invalid/photo`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(404)
  })

  it('A user should not be able to get a user photo if the user does not have a photo', async () => {
    const response = await request
      .get(`/users/${user1.username}/photo`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.photo).toBeUndefined()
  })

  it('A user should be able to get a user photo if the user has a photo', async () => {
    await request
      .put('/profile/photo')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ photo: Buffer.from('test') })
    const response = await request
      .get(`/users/${user1.username}/photo`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.photo).toBeDefined()
    expect(Buffer.from(response.body.photo).toString()).toBe('test')
  })
})

describe('Get user description', () => {
  it('A user should be able to get a user description', async () => {
    const response = await request
      .get(`/users/${user1.username}/description`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.description).toBe('')
  })

  it('A user should not be able to get a user description if the user does not exist', async () => {
    const response = await request
      .get(`/users/invalid/description`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(404)
  })

  it('A user should not be able to get a user description if the user does not have a description', async () => {
    const response = await request
      .get(`/users/${user1.username}/description`)
      .set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.description).toBe('')
  })
})
