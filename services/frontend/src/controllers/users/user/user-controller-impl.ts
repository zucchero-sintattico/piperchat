import type { UserController } from './user-controller'
import axios, { type AxiosResponse } from 'axios'
export class UserControllerImpl implements UserController {
  async getUser(): Promise<AxiosResponse<any, any>> {
    const response = await axios.get(`/users/whoami`)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad request')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 404) {
      throw new Error('User not found')
    }
    throw new Error('Unknown error')
  }

  async getUserStatus(username: string): Promise<AxiosResponse<any, any>> {
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
    throw new Error('Unknown error')
  }

  async getUserPhoto(username: string): Promise<AxiosResponse<any, any>> {
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
    throw new Error('Unknown error')
  }

  async getUserDescription(username: string): Promise<AxiosResponse<any, any>> {
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
    throw new Error('Unknown error')
  }
}
