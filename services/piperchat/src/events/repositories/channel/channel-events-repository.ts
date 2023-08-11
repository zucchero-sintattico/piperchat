export interface ChannelEventRepository {
  publishChannelCreated(entity: any): Promise<void>;

  publishChannelUpdated(entity: any): Promise<void>;

  publishChannelDeleted(entity: any): Promise<void>;
}
