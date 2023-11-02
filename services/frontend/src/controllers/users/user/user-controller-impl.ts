import type {
  GetUserDescriptionApi,
  GetUserPhotoApi,
  GetUserStatusApi,
  WhoamiApi
} from '@api/users/user'
import type { UserController } from './user-controller'
import { AxiosController } from '@/controllers/axios-controller'
import type { UpdatePhotoApi } from '@api/users/profile'
export class UserControllerImpl extends AxiosController implements UserController {
  async updateUserPhoto(request: UpdatePhotoApi.Request.Type): Promise<UpdatePhotoApi.Response> {
    return await this.put<UpdatePhotoApi.Response>('/profile/photo', request, {
      'Content-Type': 'multipart/form-data'
    })
  }
  async whoami(): Promise<WhoamiApi.Response> {
    return await this.get<WhoamiApi.Response>('/whoami')
  }

  async getUserStatus(request: GetUserStatusApi.Request.Type): Promise<GetUserStatusApi.Response> {
    const params = request as GetUserStatusApi.Request.Params
    return await this.get<GetUserStatusApi.Response>(`/users/${params.username}/status`)
  }

  async getUserPhoto(request: GetUserPhotoApi.Request.Type): Promise<GetUserPhotoApi.Response> {
    const params = request as GetUserPhotoApi.Request.Params
    return await this.get<GetUserPhotoApi.Response>(`/users/${params.username}/photo`)
  }

  async getUserDescription(
    request: GetUserDescriptionApi.Request.Type
  ): Promise<GetUserDescriptionApi.Response> {
    const params = request as GetUserDescriptionApi.Request.Params
    return await this.get<GetUserDescriptionApi.Response>(`/users/${params.username}/description`)
  }
}
