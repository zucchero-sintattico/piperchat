export interface SessionEventsRepository {
  /**
   * Publish a user joined session event
   * @param sessionId the id of the session
   * @param username the username of the user
   */
  publishUserJoinedSessionEvent(sessionId: string, username: string): Promise<void>

  /**
   * Publish a user left session event
   * @param sessionId the id of the session
   * @param username the username of the user
   */
  publishUserLeftSessionEvent(sessionId: string, username: string): Promise<void>

  /**
   * Publish a session created event
   * @param sessionId the id of the session
   * @param allowedUsers the users allowed to join the session
   */
  publishSessionCreatedEvent(sessionId: string, allowedUsers: string[]): Promise<void>

  /**
   * Publish a session ended event
   * @param sessionId the id of the session
   */
  publishSessionEndedEvent(sessionId: string): Promise<void>
}
