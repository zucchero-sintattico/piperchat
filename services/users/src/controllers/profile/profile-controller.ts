
export interface ProfileController {

    /**
     * Set the photo of a user.
     * @param username The username of the user to update.
     * @param photo The photo of the user.
     */
    updateUserPhoto(username: string, photo: Buffer): Promise<void>;

    /**
     * Set the user's description.
     * @param username The username of the user to update.
     * @param description The description of the user.
     */
    updateUserDescription(username: string, description: string): Promise<void>;
}
