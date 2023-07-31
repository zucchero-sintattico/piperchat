import { UserController } from "./user-controller";

export class UserControllerImpl implements UserController {
	getUserStatus(username: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
	setUserPhoto(username: string, photo: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	getUserPhoto(username: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
	setUserDescription(username: string, description: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	getUserDescription(username: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
}
