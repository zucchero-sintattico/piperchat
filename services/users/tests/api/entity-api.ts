import supertest from "supertest";
export class UserApi {
	private request: supertest.SuperTest<supertest.Test>;

	constructor(request: supertest.SuperTest<supertest.Test>) {
		this.request = request;
	}

	async getAllEntities() {
		return await this.request.get("/users");
	}

	async getEntityById(id: string) {
		return await this.request.get(`/users/${id}`);
	}

	async createEntity(entity: any) {
		return await this.request.post("/users").send(entity);
	}

	async updateEntity(id: string, entity: any) {
		return await this.request.put(`/users/${id}`).send(entity);
	}

	async deleteEntity(id: string) {
		return await this.request.delete(`/users/${id}`);
	}
}
