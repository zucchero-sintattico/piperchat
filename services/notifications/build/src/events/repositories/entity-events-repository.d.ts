/**
 * Entity events repository
 * It is responsible for publishing events to the message broker.
 */
export declare class EntityEventsRepository {
    private broker;
    getChannel(): import("amqplib").Channel | undefined;
    publishEntityCreated(entity: any): Promise<void>;
    publishEntityUpdated(entity: any): Promise<void>;
    publishEntityDeleted(entity: any): Promise<void>;
}
