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

export interface ServerController {
  /**
   * Get all servers of the user
   * @returns the servers of the user
   */
  getServers(): Promise<GetServersApi.Response>

  /**
   * Get a server by id
   */
  getServer(request: GetServerApi.Request.Type): Promise<GetServerApi.Response>

  /**
   * Create a server
   */
  createServer(request: CreateServerApi.Request.Type): Promise<CreateServerApi.Response>

  /**
   * Update a server
   */
  updateServer(request: UpdateServerApi.Request.Type): Promise<UpdateServerApi.Response>

  /**
   * Delete a server
   */
  deleteServer(request: DeleteServerApi.Request.Type): Promise<DeleteServerApi.Response>

  /**
   * Get all participants of a server
   */
  getServerParticipants(
    request: GetServerParticipantsApi.Request.Type
  ): Promise<GetServerParticipantsApi.Response>

  /**
   * Join a server
   */
  joinServer(request: JoinServerApi.Request.Type): Promise<JoinServerApi.Response>

  /**
   * Leave a server
   */
  leaveServer(request: LeaveServerApi.Request.Type): Promise<LeaveServerApi.Response>

  /**
   * Kick a user from a server
   */
  kickUserFromTheServer(
    request: KickUserFromServerApi.Request.Type
  ): Promise<KickUserFromServerApi.Response>
}
