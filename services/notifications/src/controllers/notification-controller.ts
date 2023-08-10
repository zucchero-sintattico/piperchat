import { UserStatusRepository, UserStatusRepositoryImpl } from "../repositories/user-status-repository";
import { ClientProxy } from "./client-proxy";

export interface NotificationController {

    /**
     * Subscribe a client to receive notifications.
     * @param username The username of the client.
     * @param clientProxy The client proxy.
     */
    subscribe(username: string, clientProxy: ClientProxy): Promise<void>;

    /**
     * Unsubscribe a client from receiving notifications.
     * @param username The username of the client.
     */
    unsubscribe(username: string): Promise<void>;

}

export class NotificationControllerImpl implements NotificationController {

    private userStatusRepository: UserStatusRepository = new UserStatusRepositoryImpl();

    async subscribe(username: string, clientProxy: ClientProxy): Promise<void> {
        await this.userStatusRepository.setOnline(username);
        // TODO subscribe to notifications
        console.log(`Subscribed ${username} to notifications`);
    }

    async unsubscribe(username: string): Promise<void> {
        await this.userStatusRepository.setOffline(username);
        // TODO unsubscribe from notifications
        console.log(`Unsubscribed ${username} from notifications`);
    }

}