import { Server } from "@/models/server-model";
import { ServerController } from "./server-controller";

export class ServerControllerImpl implements ServerController {
	createServer(
		name: string,
		description: string,
		owner: string
	): Promise<Server> {
		throw new Error("Method not implemented.");
	}
	getServers(username: string): Promise<Server[]> {
		throw new Error("Method not implemented.");
	}
	getServer(id: number): Promise<Server> {
		throw new Error("Method not implemented.");
	}
	updateServer(
		id: number,
		name?: string | undefined,
		description?: string | undefined
	): Promise<Server> {
		throw new Error("Method not implemented.");
	}
	deleteServer(id: number): Promise<Server> {
		throw new Error("Method not implemented.");
	}
	joinServer(id: number): Promise<Server> {
		throw new Error("Method not implemented.");
	}
	leaveServer(id: number): Promise<Server> {
		throw new Error("Method not implemented.");
	}
}
