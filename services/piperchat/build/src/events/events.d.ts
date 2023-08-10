/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
export declare class ServiceEvents {
    private static broker;
    static initialize(): Promise<void>;
    static declareQueue(): Promise<void>;
    static setupListeners(): Promise<void>;
}
