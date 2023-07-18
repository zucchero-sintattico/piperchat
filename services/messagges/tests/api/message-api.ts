import supertest from "supertest";
export class MessagesApi {
  private request: supertest.SuperTest<supertest.Test>;

  constructor(request: supertest.SuperTest<supertest.Test>) {
    this.request = request;
  }

  private cookie: string =
    "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJvMHQtc2V0IiwiZW1haWwiOiJwd2RAcHdkLmNvbSIsImlkIjoiNjRiNWFlZjhiODIzODBkMWQzM2FkNzQ1IiwiaWF0IjoxNjg5NjMwOTU0LCJleHAiOjE3MDI1OTA5NTR9.b-pXklIx0_TF6iLTqwcO0uweWCmcINy0xiYLYILaTSc";

  async getAllEntities() {
    return await this.request.get("/messages").set("Cookie", this.cookie);
  }

  async getEntityById(id: string) {
    return await this.request.get(`/entity/${id}`);
  }
}
