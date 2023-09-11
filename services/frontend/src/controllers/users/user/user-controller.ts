import {
  WhoamiApi,
  GetUserStatusApi,
  GetUserPhotoApi,
  GetUserDescriptionApi
} from '@api/users/user'
export interface UserController {
  /**
   * Get the current user.
   */
  whoami(): Promise<WhoamiApi.Response>

  /**
   * Get the status of a user.
   */
  getUserStatus(request: GetUserStatusApi.Request.Type): Promise<GetUserStatusApi.Response>

  /**
   * Get the photo of a user.
   */
  getUserPhoto(request: GetUserPhotoApi.Request.Type): Promise<GetUserPhotoApi.Response>

  /**
   * Get the user's description.
   */
  getUserDescription(
    request: GetUserDescriptionApi.Request.Type
  ): Promise<GetUserDescriptionApi.Response>
}
