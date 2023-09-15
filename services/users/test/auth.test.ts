import supertest, { Response } from 'supertest'
import { Microservice } from '@commons/service'
import { UserServiceConfiguration } from '@/configuration'

const userMicroservice: Microservice = new Microservice(UserServiceConfiguration)
let request: supertest.SuperTest<supertest.Test>

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

async function register(
  username: string,
  password: string,
  email: string
): Promise<Response> {
  return await request.post('/auth/register').send({ username, password, email })
}
async function login(username: string, password: string): Promise<Response> {
  return await request.post('/auth/login').send({ username, password })
}
async function createUserAndLogin(
  username: string,
  password: string,
  email: string
): Promise<Response> {
  await register(username, password, email)
  return login(username, password)
}

describe('Register', () => {
  it('A user must provide username, password and email', async () => {
    let response = await request
      .post('/auth/register')
      .send({ username: 'test', password: 'test' })
    expect(response.status).toBe(400)
    response = await request
      .post('/auth/register')
      .send({ username: 'test', email: 'test' })
    expect(response.status).toBe(400)
    response = await request
      .post('/auth/register')
      .send({ password: 'test', email: 'test' })
    expect(response.status).toBe(400)
    response = await request
      .post('/auth/register')
      .send({ username: 'test', password: 'test', email: 'test' })
    expect(response.status).toBe(200)
  })

  it('A new user should be able to register only once with the same username', async () => {
    let response = await register('test', 'test', 'test')
    expect(response.status).toBe(200)
    response = await register('test', 'test', 'test')
    expect(response.status).toBe(409)
  })

  it('A user should be able to register only once with the same email', async () => {
    let response = await register('test', 'test', 'email')
    expect(response.status).toBe(200)
    response = await register('test1', 'test1', 'email')
    expect(response.status).toBe(409)
  })
})

describe('Login', () => {
  it('A user should provide username and password to login', async () => {
    let response = await register('test', 'test', 'test')
    response = await request.post('/auth/login').send({ username: 'test' })
    expect(response.status).toBe(400)
    response = await request.post('/auth/login').send({ password: 'test' })
    expect(response.status).toBe(400)
    response = await request
      .post('/auth/login')
      .send({ username: 'test', password: 'test' })
    expect(response.status).toBe(200)
  })
  it('A user should be able to login after register', async () => {
    await register('test', 'test', 'test')
    const response = await login('test', 'test')
    expect(response.status).toBe(200)
    expect(response.header['set-cookie']).toHaveLength(1)
  })

  it('A user should not be able to login with wrong password', async () => {
    await register('test', 'test', 'test')
    const response = await login('test', 'test1')
    expect(response.status).toBe(401)
  })

  it('A user should not be able to login with wrong username', async () => {
    await register('test', 'test', 'test')
    const response = await login('test1', 'test')
    expect(response.status).toBe(401)
  })

  it('A user should not be able to login with wrong username and password', async () => {
    await register('test', 'test', 'test')
    const response = await login('test1', 'test1')
    expect(response.status).toBe(401)
  })
})

describe('Logout', () => {
  it('A user should be able to logout', async () => {
    let response = await createUserAndLogin('test', 'test', 'test')
    const cookie = response.header['set-cookie']
    response = await request.post('/auth/logout').set('Cookie', cookie)
    console.log(response.body, response.text)
    expect(response.status).toBe(200)
  })

  it('A user should not be able to logout without jwt', async () => {
    let response = await createUserAndLogin('test', 'test', 'test')
    const cookie = response.header['set-cookie']
    response = await request.post('/auth/logout')
    expect(response.status).toBe(401)
    response = await request.post('/auth/logout').set('Cookie', cookie)
    expect(response.status).toBe(200)
  })

  it('A user should not be able to logout with wrong jwt', async () => {
    let response = await createUserAndLogin('test', 'test', 'test')
    const cookie = response.header['set-cookie']
    response = await request.post('/auth/logout').set(
      'Cookie',
      cookie.map((c: string) => c.replace('jwt=', 'jwt=wrong'))
    )
    expect(response.status).toBe(401)
    response = await request.post('/auth/logout').set('Cookie', cookie)
    expect(response.status).toBe(200)
  })
})

describe('Refresh token', () => {
  it('A user should be able to refresh token', async () => {
    let response = await createUserAndLogin('test', 'test', 'test')
    const cookie = response.header['set-cookie']
    response = await request.post('/auth/refresh-token').set('Cookie', cookie)
    expect(response.status).toBe(200)
    expect(response.header['set-cookie']).toHaveLength(1)
  })
})
