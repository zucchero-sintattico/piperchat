import { AxiosController } from '@/controllers/axios-controller'
import type { ProfileController } from './profile-controller'
import type { UpdateDescriptionApi, UpdatePhotoApi } from '@api/users/profile'

export class ProfileControllerImpl extends AxiosController implements ProfileController {
  async updateUserPhoto(request: UpdatePhotoApi.Request.Type): Promise<UpdatePhotoApi.Response> {
    const body = request as UpdatePhotoApi.Request.Body
    return await this.put<UpdatePhotoApi.Response>('/profile/photo', body)
  }

  async updateUserDescription(
    request: UpdateDescriptionApi.Request.Type
  ): Promise<UpdateDescriptionApi.Response> {
    const body = request as UpdateDescriptionApi.Request.Body
    return await this.put<UpdatePhotoApi.Response>('/profile/description', body)
  }
}
