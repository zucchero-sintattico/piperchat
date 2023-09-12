import { UpdatePhotoApi, UpdateDescriptionApi } from '@api/users/profile'
export interface ProfileController {
  /**
   * Set the photo of a user.
   * @param photo The photo of the user.
   */
  updateUserPhoto(request: UpdatePhotoApi.Request.Type): Promise<UpdatePhotoApi.Response>

  /**
   * Set the user's description.
   * @param description The description of the user.
   */
  updateUserDescription(
    request: UpdateDescriptionApi.Request.Type
  ): Promise<UpdateDescriptionApi.Response>
}
