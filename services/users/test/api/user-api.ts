import supertest from 'supertest'
export class UserApi {
  private request: supertest.SuperTest<supertest.Test>

  constructor(request: supertest.SuperTest<supertest.Test>) {
    this.request = request
  }

  private cookie: string = ''

  // register a new user and save the access token
  async register(username: string, email: string, password: string) {
    return await this.request.post('/auth/register').send({
      username: username,
      email: email,
      password: password,
    })
  }

  // login a user and save the access token
  async login(username: string, password: string) {
    const response = await this.request.post('/auth/login').send({
      username: username,
      password: password,
    })
    this.cookie = response.header['set-cookie']
    return response
  }

  async logout() {
    const response = await this.request.post('/auth/logout').set('Cookie', this.cookie)
    this.cookie = ''
    return response
  }

  async getDescription(username: string) {
    return await this.request
      .get(`/users/${username}/description`)
      .set('Cookie', this.cookie)
  }

  async updateDescription(description: string) {
    return await this.request
      .put('/profile/description')
      .set('Cookie', this.cookie)
      .set('Content-Type', 'application/json')
      .send({
        description: description,
      })
  }

  async getAllFriends() {
    return await this.request.get('/friends').set('Cookie', this.cookie)
  }

  async sendFriendRequest(username: string) {
    return await this.request.post('/friends/requests').set('Cookie', this.cookie).send({
      action: 'send',
      to: username,
    })
  }

  async acceptFriendRequest(username: string) {
    return await this.request.post('/friends/requests').set('Cookie', this.cookie).send({
      action: 'accept',
      to: username,
    })
  }

  async denyFriendRequest(username: string) {
    return await this.request.post('/friends/requests').set('Cookie', this.cookie).send({
      action: 'deny',
      to: username,
    })
  }
}
