import amqp from "amqplib";

export class RabbitMQ {
	static instance: RabbitMQ;

	private connectionUri: string;
	private connection: amqp.Connection | undefined;
	private channel: amqp.Channel | undefined;

	static async initialize(connectionUri: string) {
		if (!RabbitMQ.instance) {
			RabbitMQ.instance = new RabbitMQ(connectionUri);
			await RabbitMQ.instance.connect();
		}
	}

	static async close() {
		if (RabbitMQ.instance) {
			await RabbitMQ.instance.connection?.close();
		}
	}

	static getInstance() {
		if (!RabbitMQ.instance) {
			throw new Error("RabbitMQ not initialized");
		}
		return RabbitMQ.instance;
	}

	private constructor(connectionUri: string) {
		this.connectionUri = connectionUri;
	}

	async connect() {
		try {
			this.connection = await amqp.connect(this.connectionUri);
			this.channel = await this.connection.createChannel();
			console.log("Connected to RabbitMQ");
		} catch (err) {
			console.error(err);
		}
	}

	getChannel() {
		return this.channel;
	}
}
