import { AxiosController } from '@/controllers/axios-controller'
import type { FriendsController } from './friends-controller'
import {
  SendFriendRequestApi,
  type GetFriendsApi,
  type GetFriendsRequestsApi
} from '@api/users/friends'

export class FriendsControllerImpl extends AxiosController implements FriendsController {
  async getFriends(): Promise<GetFriendsApi.Response> {
    return await this.get<GetFriendsApi.Response>('/friends')
  }

  async getFriendsRequests(): Promise<GetFriendsRequestsApi.Response> {
    return await this.get<GetFriendsRequestsApi.Response>('/friends/requests')
  }

  async sendFriendRequest(to: string): Promise<SendFriendRequestApi.Response> {
    const body: SendFriendRequestApi.Request.Body = {
      to: to,
      action: SendFriendRequestApi.Request.FriendRequestAction.send
    }
    return await this.post<SendFriendRequestApi.Response>('/friends/requests', body)
  }

  async acceptFriendRequest(to: string): Promise<SendFriendRequestApi.Response> {
    const body: SendFriendRequestApi.Request.Body = {
      to: to,
      action: SendFriendRequestApi.Request.FriendRequestAction.accept
    }
    return await this.post<SendFriendRequestApi.Response>('/friends/requests', body)
  }

  async denyFriendRequest(to: string): Promise<SendFriendRequestApi.Response> {
    const body: SendFriendRequestApi.Request.Body = {
      to: to,
      action: SendFriendRequestApi.Request.FriendRequestAction.deny
    }
    return await this.post<SendFriendRequestApi.Response>('/friends/requests', body)
  }
}
