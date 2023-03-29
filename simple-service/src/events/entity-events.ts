import { RabbitMQ } from "../utils/rabbit-mq";

export class EntityEvents {
	private instance: RabbitMQ;
	constructor() {
		this.instance = RabbitMQ.getInstance();
	}

	async publishEntityCreated(entity: any) {
		const channel = this.instance.getChannel();
		if (channel) {
			channel.publish(
				"entity",
				"entity.created",
				Buffer.from(JSON.stringify(entity))
			);
		}
	}

	async publishEntityUpdated(entity: any) {
		const channel = this.instance.getChannel();
		if (channel) {
			channel.publish(
				"entity",
				"entity.updated",
				Buffer.from(JSON.stringify(entity))
			);
		}
	}
}
