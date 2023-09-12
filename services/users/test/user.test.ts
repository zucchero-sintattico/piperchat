import supertest from 'supertest'
import { UserApi } from './api/user-api'
import { Microservice } from '@commons/service'
import { UserServiceConfiguration } from '@/configuration'

let userApi: UserApi
let userMicroservice: Microservice

beforeAll(async () => {
  userMicroservice = new Microservice(UserServiceConfiguration)
  await userMicroservice.start()
  userApi = new UserApi(supertest(userMicroservice.getServer()))
})

afterAll(async () => {
  await userMicroservice.stop()
})

afterEach(async () => {
  await userMicroservice.clearDatabase()
})

beforeEach(async () => {
  let response = await userApi.register('test0', 'test0', 'test0')
  expect(response.status).toBe(200)
  response = await userApi.register('test1', 'test1', 'test1')
  expect(response.status).toBe(200)
})

describe('User authentication', () => {
  it('A user must provide username, password and email', async () => {
    const response = await userApi.registerWithoutEmail('test', 'test')
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
