export interface ServerEventsRepository {
  publishServerCreated(payload: any): Promise<void>

  publishServerUpdated(payload: any): Promise<void>

  publishServerDeleted(payload: any): Promise<void>

  publishUserJoined(payload: any): Promise<void>

  publishUserLeft(payload: any): Promise<void>

  publishUserKicked(payload: any): Promise<void>
}
