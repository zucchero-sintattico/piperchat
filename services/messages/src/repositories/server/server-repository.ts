export interface ServerRepository {
  /**
   * Add partecipant to server
   * @param serverId
   * @param participantId
   * @returns Promise<void>
   */
  addParticipant(serverId: string, participantId: string): Promise<void>

  /**
   * Remove partecipant from server
   * @param serverId
   * @param participantId
   * @returns Promise<void>
   */
  removeParticipant(serverId: string, participantId: string): Promise<void>

  /**
   * Add server
   * @param serverId
   * @param participantId
   * @returns Promise<void>
   */
  addServer(serverId: string, participantId: string): Promise<void>

  /**
   * Get servers partecipant
   * @param serverId
   * @returns Promise<string[]>
   */
  getServerParticipants(serverId: string): Promise<string[]>

  /**
   * Remove server
   * @param serverId
   *
   * @returns Promise<void>
   *
   */
  removeServer(serverId: string): Promise<void>

  /**
   * Add message channel
   * @param serverId
   * @param channelId
   * @returns Promise<void>
   *
   */

  addMessageChannel(serverId: string, channelId: string): Promise<void>

  /**
   * Remove message channel
   * @param serverId
   * @param channelId
   * @returns Promise<void>
   *
   */
  removeMessageChannel(serverId: string, channelId: string): Promise<void>

  containsMessageChannel(serverId: string, channelId: string): Promise<boolean>
}
