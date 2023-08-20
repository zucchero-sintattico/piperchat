export interface ChannelEventsRepository {
  publishChannelCreated(payload: any): Promise<void>

  publishChannelUpdated(payload: any): Promise<void>

  publishChannelDeleted(payload: any): Promise<void>
}
