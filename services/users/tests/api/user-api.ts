import supertest from "supertest";
export class UserApi {
	private request: supertest.SuperTest<supertest.Test>;

	constructor(request: supertest.SuperTest<supertest.Test>) {
		this.request = request;
	}

	private cookie: string = "";


	// register a new user and save the access token
	async register(username: string, email: string, password: string) {
		const response = await this.request.post("/auth/register").send({
			username: username,
			email: email,
			password: password,
		});
	}

	// login a user and save the access token
	async login(username: string, password: string) {
		const response = await this.request.post("/auth/login").send({
			username: username,
			password: password,
		});
		this.cookie = response.header["set-cookie"];
	}

	//delete a user
	async deleteUser(username: string) {
		return await this.request.delete("/user/" + username).set("Cookie", this.cookie);
	}

	async getAllFriends() {
		console.log("cookieeeee" + this.cookie);
		return await this.request.get("/friends").set("Cookie", this.cookie);
	}


	//send a friend request
	async sendFriendRequest(username: string) {
		return await this.request.post("/friends/requests").set("Cookie", this.cookie).send({
			action: "send",
			to: username,
		});
	}

	//accept a friend request
	async acceptFriendRequest(username: string) {
		return await this.request.post("/friends/requests").set("Cookie", this.cookie).send({
			action: "accept",
			to: username,
		});
	}



}
