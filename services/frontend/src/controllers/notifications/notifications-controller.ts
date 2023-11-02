import { GetUserStatusApi } from '@api/users/user'
import { AxiosController } from '../axios-controller'

export interface NotificationController {
  getUserStatus(username: string): Promise<GetUserStatusApi.Response>
}

export class NotificationControllerImpl extends AxiosController implements NotificationController {
  async getUserStatus(username: string): Promise<GetUserStatusApi.Response> {
    return this.get<GetUserStatusApi.Response>(`/users/${username}/status`)
  }
}
