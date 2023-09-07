import type { AuthController } from './auth-controller'
import axios from 'axios'

export class AuthControllerImpl implements AuthController {
  async register(
    username: string,
    email: string,
    password: string,
    description: string | null,
    photo: string | null
  ): Promise<string> {
    const data = {
      username: username,
      email: email,
      password: password,
      description: description,
      photo: photo
    }

    const response = await axios.post('/auth/register', data)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad requestd')
    } else if (response.status === 409) {
      throw new Error('UserAlreadyExists')
    }

    return Promise.resolve('register success')
  }

  async login(username: string, password: string): Promise<string> {
    const data = {
      username: username,
      password: password
    }

    const response = await axios.post('/auth/login', data)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad requestd')
    } else if (response.status === 401) {
      throw new Error('InvalidUsernameOrPassword')
    }

    return Promise.resolve('login success')
  }

  async logout(): Promise<void> {
    const response = await axios.post('/auth/logout')
    if (response.status === 200) {
      console.log('logout success')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    }
    return Promise.resolve()
  }

  async refreshToken(): Promise<string> {
    const response = await axios.post('/auth/refresh')
    if (response.status === 200) {
      return response.data
    } else if (response.status === 401) {
      throw new Error('InvalidRefreshToken')
    }

    return Promise.resolve('refresh success')
  }
}
