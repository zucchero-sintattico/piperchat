/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export declare class MonitoringRepository {
    createUserEvent(user: any): Promise<void>;
    createMessageEvent(message: any): Promise<void>;
}
