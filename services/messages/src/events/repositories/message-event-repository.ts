/**
 * Entity events repository
 * It is responsible for publishing events to the message broker.
 */
export interface MessageEventRepository {
  publishNewMessageOnChannel(payload: any): Promise<void>;

  publishNewMessageOnDirect(payload: any): Promise<void>;
}
