import type { ProfileController } from './profile-controller'
import axios from 'axios'

export class ProfileControllerImpl implements ProfileController {
  async updateUserPhoto(photo: string): Promise<void> {
    const data = {
      photo: photo
    }

    const response = await axios.put('/profile/photo', data)
    if (response.status === 200) {
      console.log('update photo success')
    } else if (response.status === 400) {
      throw new Error('Bad requestd')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    }
    return Promise.resolve()
  }
  async updateUserDescription(description: string): Promise<void> {
    const data = {
      description: description
    }

    const response = await axios.put('/profile/description', data)
    if (response.status === 200) {
      console.log('update description success')
    } else if (response.status === 400) {
      throw new Error('Bad requestd')
    } else if (response.status === 401) {
      throw new Error('Access token is missing or invalid')
    }
    return Promise.resolve()
  }
}
