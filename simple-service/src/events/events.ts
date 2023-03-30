import { EntityRepository } from "../repositories/entity-repository";
import { RabbitMQ } from "../utils/rabbit-mq";

export class ServiceEvents {
	private static broker: RabbitMQ;
	private static entityRepository: EntityRepository = new EntityRepository();
	static async initialize() {
		this.broker = RabbitMQ.getInstance();
		this.setupListeners();
	}

	static async setupListeners() {
		// Setup listeners
		this.broker.getChannel()?.consume("entity.entity.created", (msg) => {
			if (msg) {
				console.log("Entity created", msg.content.toString());
				this.broker.getChannel()?.ack(msg);
				this.entityRepository.createEntity(JSON.parse(msg.content.toString()));
			}
		});
	}
}
