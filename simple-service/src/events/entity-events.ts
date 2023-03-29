import { RabbitMQ } from "../utils/rabbit-mq";

export class EntityEvents {
	private static _instance: RabbitMQ;

	static getInstance() {
		if (!this._instance) {
			this._instance = RabbitMQ.getInstance();
		}
		return this._instance;
	}

	static getChannel() {
		return this.getInstance().getChannel();
	}

	static async publishEntityCreated(entity: any) {
		const channel = this.getChannel();
		if (channel) {
			channel.publish(
				"entity",
				"entity.created",
				Buffer.from(JSON.stringify(entity))
			);
		}
	}

	static async publishEntityUpdated(entity: any) {
		const channel = this.getChannel();
		if (channel) {
			channel.publish(
				"entity",
				"entity.updated",
				Buffer.from(JSON.stringify(entity))
			);
		}
	}
}
