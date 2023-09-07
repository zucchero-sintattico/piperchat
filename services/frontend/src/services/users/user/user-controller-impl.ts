import type { UserController } from './user-controller'
import axios from 'axios'
export class UserControllerImpl implements UserController {
  async getUser(username: string): Promise<string> {
    const response = await axios.get(`/users/${username}/user`)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad request')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 404) {
      throw new Error('User not found')
    }
    return Promise.resolve('user getted')
  }

  async getUserStatus(username: string): Promise<string> {
    const response = await axios.get(`/users/${username}/status`)

    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad request')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 404) {
      throw new Error('User not found')
    }
    return Promise.resolve('user status getted')
  }

  async getUserPhoto(username: string): Promise<string> {
    const response = await axios.get(`/users/${username}/photo`)

    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad request')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 404) {
      throw new Error('User not found')
    }
    return Promise.resolve('user photo getted')
  }

  async getUserDescription(username: string): Promise<string> {
    const response = await axios.get(`/users/${username}/description`)

    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad request')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 404) {
      throw new Error('User not found')
    }
    return Promise.resolve('user description getted')
  }
}
