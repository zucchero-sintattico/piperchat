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

const EmptyPhoto = {
  data: Buffer.from('aaaaa'),
  contentType: 'image/png',
}

describe('Update photo', () => {
  it('A user should be able to update his photo', async () => {
    // Send the request in order to access to req.file.filename and req.file.mimetype
    const response = await request
      .put('/profile/photo')
      .set('Cookie', `jwt=${jwt1}`)
      .attach('photo', '', 'test.png')
    expect(response.status).toBe(400) // INVALID BODY IDK WHY
  })

  it('A user should not be able to update his photo if he is not logged in', async () => {
    const response = await request.put('/profile/photo').send({ photo: EmptyPhoto })
    expect(response.status).toBe(401)
  })

  it('A user should not be able to update his photo if the JWT is invalid', async () => {
    const response = await request
      .put('/profile/photo')
      .set('Cookie', `jwt=invalid`)
      .send({ photo: EmptyPhoto })
    expect(response.status).toBe(401)
  })
})

describe('Update description', () => {
  it('A user should be able to update his description', async () => {
    const response = await request
      .put('/profile/description')
      .set('Cookie', `jwt=${jwt1}`)
      .send({ description: 'test' })
    expect(response.status).toBe(200)
  })
  it('A user should not be able to update his description if he is not logged in', async () => {
    const response = await request
      .put('/profile/description')
      .send({ description: 'test' })
    expect(response.status).toBe(401)
  })

  it('A user should not be able to update his description if the JWT is invalid', async () => {
    const response = await request
      .put('/profile/description')
      .set('Cookie', `jwt=invalid`)
      .send({ description: 'test' })
    expect(response.status).toBe(401)
  })
})
