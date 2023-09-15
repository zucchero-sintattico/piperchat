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
const jwt2 = generateAccessToken(user2)

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

describe('Get friends', () => {
  it('A user should be able to get his friends', async () => {
    const response = await request.get('/friends').set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.friends).toEqual([])
  })

  it('A user should not be able to get his friends if he is not logged in', async () => {
    const response = await request.get('/friends')
    expect(response.status).toBe(401)
  })

  it('A user should not be able to get his friends if the JWT is invalid', async () => {
    const response = await request.get('/friends').set('Cookie', `jwt=invalid`)
    expect(response.status).toBe(401)
  })
})

describe('Get friends requests', () => {
  it('A user should be able to get his friends requests', async () => {
    const response = await request.get('/friends/requests').set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.requests).toEqual([])
  })

  it('A user should not be able to get his friends requests if he is not logged in', async () => {
    const response = await request.get('/friends/requests')
    expect(response.status).toBe(401)
  })

  it('A user should not be able to get his friends requests if the JWT is invalid', async () => {
    const response = await request.get('/friends/requests').set('Cookie', `jwt=invalid`)
    expect(response.status).toBe(401)
  })
})

describe('Send friend request', () => {
  it('A user should not be able to send a friend request if he is not logged in', async () => {
    const response = await request
      .post('/friends/requests')
      .send({ to: user2.username, action: 'send' })
    expect(response.status).toBe(401)
  })

  it('A user should be able to send a friend request', async () => {
    let response = await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ to: user2.username, action: 'send' })
    expect(response.status).toBe(200)
    response = await request.get('/friends/requests').set('Cookie', `jwt=${jwt2}`)
    expect(response.status).toBe(200)
    expect(response.body.requests).toEqual([user1.username])
  })

  it('A user should not be able to send a friend request to himself', async () => {
    const response = await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ to: user1.username, action: 'send' })
    expect(response.status).toBe(400)
  })

  it('A user should not be able to send a friend request to a user that does not exist', async () => {
    const response = await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ to: 'invalid', action: 'send' })
    expect(response.status).toBe(404)
  })

  it('A user should not be able to send a friend request to a user that already sent a friend request', async () => {
    await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ to: user2.username, action: 'send' })
    const response = await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ to: user2.username, action: 'send' })
    expect(response.status).toBe(409)
  })
})

describe('Accept friend request', () => {
  it('A user should not be able to accept a friend request if he is not logged in', async () => {
    const response = await request
      .post('/friends/requests')
      .send({ to: user2.username, action: 'accept' })
    expect(response.status).toBe(401)
  })

  it('A user should be able to accept a friend request', async () => {
    await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ to: user2.username, action: 'send' })
    let response = await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt2}`)
      .send({ to: user1.username, action: 'accept' })
    expect(response.status).toBe(200)
    response = await request.get('/friends').set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.friends).toEqual([user2.username])
    response = await request.get('/friends').set('Cookie', `jwt=${jwt2}`)
    expect(response.status).toBe(200)
    expect(response.body.friends).toEqual([user1.username])
  })

  it('A user should not be able to accept a friend request if he did not receive a friend request', async () => {
    const response = await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ to: user2.username, action: 'accept' })
    expect(response.status).toBe(404)
  })

  it('A user should not be able to accept a friend request if the user does not exist', async () => {
    const response = await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ to: 'invalid', action: 'accept' })
    expect(response.status).toBe(404)
  })
})

describe('Decline friend request', () => {
  it('A user should not be able to decline a friend request if he is not logged in', async () => {
    const response = await request
      .post('/friends/requests')
      .send({ to: user2.username, action: 'deny' })
    expect(response.status).toBe(401)
  })

  it('A user should be able to decline a friend request', async () => {
    await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ to: user2.username, action: 'send' })
    let response = await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt2}`)
      .send({ to: user1.username, action: 'deny' })
    console.log(response.body)
    expect(response.status).toBe(200)
    response = await request.get('/friends').set('Cookie', `jwt=${jwt1}`)
    expect(response.status).toBe(200)
    expect(response.body.friends).toEqual([])
    response = await request.get('/friends').set('Cookie', `jwt=${jwt2}`)
    expect(response.status).toBe(200)
    expect(response.body.friends).toEqual([])
  })

  it('A user should not be able to decline a friend request if he did not receive a friend request', async () => {
    const response = await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ to: user2.username, action: 'deny' })
    expect(response.status).toBe(404)
  })

  it('A user should not be able to decline a friend request if the user does not exist', async () => {
    const response = await request
      .post('/friends/requests')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ to: 'invalid', action: 'deny' })
    expect(response.status).toBe(404)
  })
})
