export interface DirectController {
  /**
   * Get direct messages between two users using as pagination the "from" and "limit" query params
   * @param username
   * @param from
   * @param limit
   * @returns {Promise<Direct[]>}
   */
  getDirectMessagesPaginated(username: string, from: number, limit: number): Promise<any>

  /**
   * Send a direct message from one user to another
   * @param username
   * @param message
   */
  sendDirectMessage(username: string, message: string): Promise<void>
}
