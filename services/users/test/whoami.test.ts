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

describe('Whoami', () => {
  it('A user should be able to get his info', async () => {
    const response = await request.get('/whoami').set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.user.username).toBe(user1.username)
    expect(response.body.user.email).toBe(user1.email)
  })

  it('A user should not be able to get his info if he is not logged in', async () => {
    const response = await request.get('/whoami')
    expect(response.status).toBe(401)
  })

  it('A user should not be able to get his info if the JWT is invalid', async () => {
    const response = await request.get('/whoami').set('Cookie', `jwt=invalid`)
    expect(response.status).toBe(401)
  })
})
