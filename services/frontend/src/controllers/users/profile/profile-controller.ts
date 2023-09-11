export interface ProfileController {
  /**
   * Set the photo of a user.
   * @param photo The photo of the user.
   */
  updateUserPhoto(photo: string): Promise<void>

  /**
   * Set the user's description.
   * @param description The description of the user.
   */
  updateUserDescription(description: string): Promise<void>
}
