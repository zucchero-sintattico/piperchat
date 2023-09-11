import type { FriendsController } from './friends-controller'
import axios from 'axios'

export class FriendsControllerImpl implements FriendsController {
  async getFriends(): Promise<string[]> {
    const response = await axios.get('/friends')
    if (response.status === 200) {
      return response.data
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    }
    return Promise.resolve([])
  }

  async getFriendsRequests(): Promise<string[]> {
    const response = await axios.get('/friends/requests')
    if (response.status === 200) {
      return response.data
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    }
    return Promise.resolve([])
  }

  async sendFriendRequest(friendUsername: string): Promise<void> {
    const data = {
      friendUsername: friendUsername
    }

    const response = await axios.post('/friends/requests', data)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad requestd')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 404) {
      throw new Error('UserNotFound')
    }
    return Promise.resolve()
  }

  async acceptFriendRequest(friendUsername: string): Promise<void> {
    const data = {
      friendUsername: friendUsername,
      action: 'accept'
    }

    const response = await axios.post('/friends/requests', data)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad requestd')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 404) {
      throw new Error('UserNotFound')
    } else if (response.status === 409) {
      throw new Error('FriendRequestNotPresent')
    }
    return Promise.resolve()
  }

  async denyFriendRequest(friendUsername: string): Promise<void> {
    const data = {
      friendUsername: friendUsername,
      action: 'deny'
    }

    const response = await axios.post('/friends/requests', data)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad requestd')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 404) {
      throw new Error('UserNotFound')
    } else if (response.status === 409) {
      throw new Error('FriendRequestNotPresent')
    }
    return Promise.resolve()
  }
}
