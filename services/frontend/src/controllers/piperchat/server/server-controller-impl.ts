import { AxiosController } from '@/controllers/axios-controller'
import type { ServerController } from './server-controller'
import {
  CreateServerApi,
  DeleteServerApi,
  GetServerApi,
  GetServerParticipantsApi,
  GetServersApi,
  JoinServerApi,
  KickUserFromServerApi,
  LeaveServerApi,
  UpdateServerApi
} from '@api/piperchat/server'

export class ServerControllerImpl extends AxiosController implements ServerController {
  async getServers(): Promise<GetServersApi.Response> {
    return await this.get<GetServersApi.Response>('/servers')
  }

  async getServer(request: GetServerApi.Request.Type): Promise<GetServerApi.Response> {
    const params = request as GetServerApi.Request.Params
    return await this.get<GetServerApi.Response>(`/servers/${params.serverId}`)
  }

  async createServer(request: CreateServerApi.Request.Type): Promise<CreateServerApi.Response> {
    const body = request as CreateServerApi.Request.Body
    return await this.post<CreateServerApi.Response>('/servers', body)
  }

  async updateServer(request: UpdateServerApi.Request.Type): Promise<UpdateServerApi.Response> {
    const params = request as UpdateServerApi.Request.Params
    const body = request as UpdateServerApi.Request.Body
    return await this.put<UpdateServerApi.Response>(`/servers/${params.serverId}`, body)
  }

  async deleteServer(request: DeleteServerApi.Request.Type): Promise<DeleteServerApi.Response> {
    const params = request as DeleteServerApi.Request.Params
    return await this.delete<DeleteServerApi.Response>(`/servers/${params.serverId}`)
  }

  async getServerParticipants(
    request: GetServerParticipantsApi.Request.Type
  ): Promise<GetServerParticipantsApi.Response> {
    const params = request as GetServerParticipantsApi.Request.Params
    return await this.get<GetServerParticipantsApi.Response>(
      `/servers/${params.serverId}/participants`
    )
  }

  async joinServer(request: JoinServerApi.Request.Type): Promise<JoinServerApi.Response> {
    const params = request as JoinServerApi.Request.Params
    return await this.post<JoinServerApi.Response>(`/servers/${params.serverId}/participants`)
  }

  async leaveServer(request: LeaveServerApi.Request.Type): Promise<LeaveServerApi.Response> {
    const params = request as LeaveServerApi.Request.Params
    return await this.delete<LeaveServerApi.Response>(`/servers/${params.serverId}/participants`)
  }

  async kickUserFromTheServer(
    request: KickUserFromServerApi.Request.Type
  ): Promise<KickUserFromServerApi.Response> {
    const params = request as KickUserFromServerApi.Request.Params
    const body = request as KickUserFromServerApi.Request.Body
    return await this.delete<KickUserFromServerApi.Response>(
      `/servers/${params.serverId}/participants/${params.username}`,
      body
    )
  }
}
