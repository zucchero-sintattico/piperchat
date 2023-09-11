import type { ChannelController } from './channel-controller'
import axios from 'axios'

export class ChannelControllerImpl implements ChannelController {
  async deleteChannel(serverId: string, channelId: string): Promise<any> {
    const response = await axios.delete(`/servers/${serverId}/channels/${channelId}`)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 403) {
      throw new Error('UserNotAuthorized')
    } else if (response.status === 404) {
      throw new Error('ServerNotFound')
    }
  }

  async getChannels(serverId: string): Promise<any> {
    const response = await axios.get(`/servers/${serverId}/channels`)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 404) {
      throw new Error('ServerNotFound')
    }
    return Promise.resolve('getChannels success')
  }

  async getChannelById(serverId: string, channelId: string): Promise<any> {
    const response = await axios.get(`/servers/${serverId}/channels/${channelId}`)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 404) {
      throw new Error('ServerNotFound')
    }
    return Promise.resolve('getChannelById success')
  }

  async createChannel(
    serverId: string,
    name: string,
    channelType: string,
    description?: string
  ): Promise<any> {
    const data = {
      name: name,
      channelType: channelType,
      description: description
    }

    const response = await axios.post(`/servers/${serverId}/channels`, data)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad requestd')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    } else if (response.status === 404) {
      throw new Error('ServerNotFound')
    } else if (response.status === 409) {
      throw new Error('ChannelAlreadyExists')
    }
    return Promise.resolve('createChannel success')
  }

  async updateChannel(
    serverId: string,
    channelId: string,
    name?: string,
    description?: string
  ): Promise<any> {
    const data = {
      name: name,
      description: description
    }

    const response = await axios.put(`/servers/${serverId}/channels/${channelId}`, data)
    if (response.status === 200) {
      return response.data
    } else if (response.status === 400) {
      throw new Error('Bad requestd')
    }
  }
}
