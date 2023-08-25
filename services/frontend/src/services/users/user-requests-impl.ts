import axios from 'axios'
import VueCookies from 'vue-cookies'

export class UserRequestImpl implements UserRequest {
  register(username: string, password: string, email: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
  logout(): Promise<string> {
    throw new Error('Method not implemented.')
  }
  getUserFromToken(): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async login(username: string, password: string): Promise<any> {
    const data = JSON.stringify({
      username: username,
      password: password
    })

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/auth/login',
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
        'Content-Type': 'application/json'
      },
      data: data,
      withCredentials: true
    }
    try {
      const response = await axios.request(config)
      return response
    } catch (error) {
      console.log(error)
    }
  }
}
