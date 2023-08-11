export interface ServerEventRepository {
  publishServerCreated(entity: any): Promise<void>;

  publishServerUpdated(entity: any): Promise<void>;

  publishServerDeleted(entity: any): Promise<void>;

  publishUserJoined(entity: any): Promise<void>;

  publishUserLeft(entity: any): Promise<void>;

  publishUserKicked(entity: any): Promise<void>;
}
