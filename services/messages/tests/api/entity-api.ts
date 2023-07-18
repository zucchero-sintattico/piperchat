import supertest from "supertest";
export class EntityApi {
	private request: supertest.SuperTest<supertest.Test>;

	constructor(request: supertest.SuperTest<supertest.Test>) {
		this.request = request;
	}

	async getAllEntities() {
		return await this.request.get("/entity");
	}

	async getEntityById(id: string) {
		return await this.request.get(`/entity/${id}`);
	}

	async createEntity(entity: any) {
		return await this.request.post("/entity").send(entity);
	}

	async updateEntity(id: string, entity: any) {
		return await this.request.put(`/entity/${id}`).send(entity);
	}

	async deleteEntity(id: string) {
		return await this.request.delete(`/entity/${id}`);
	}
}
