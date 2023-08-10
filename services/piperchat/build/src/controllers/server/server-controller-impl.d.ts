import { Server } from "../../models/server-model";
import { ServerController } from "./server-controller";
export declare class ServerControllerImpl implements ServerController {
    createServer(name: string, description: string, owner: string): Promise<Server>;
    getServers(username: string): Promise<Server[]>;
    getServer(id: number): Promise<Server>;
    updateServer(id: number, name?: string | undefined, description?: string | undefined): Promise<Server>;
    deleteServer(id: number): Promise<Server>;
    joinServer(id: number): Promise<Server>;
    leaveServer(id: number): Promise<Server>;
}
