import amqp from 'amqplib'

export class RabbitMQ {
  static instance: RabbitMQ | undefined

  private connectionUri: string
  private connection: amqp.Connection | undefined
  private channel: amqp.Channel | undefined

  static async initialize(connectionUri: string) {
    if (!RabbitMQ.instance) {
      console.log('Initializing RabbitMQ')
      RabbitMQ.instance = new RabbitMQ(connectionUri)
      await RabbitMQ.instance.connect()
    }
  }

  static async disconnect() {
    if (RabbitMQ.instance) {
      await RabbitMQ.instance.connection?.close()
    }
  }

  static getInstance() {
    if (!RabbitMQ.instance) {
      console.log(RabbitMQ.instance)
      throw new Error('RabbitMQ not initialized')
    }
    return RabbitMQ.instance
  }

  private constructor(connectionUri: string) {
    this.connectionUri = connectionUri
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.connectionUri)
      this.channel = await this.connection.createChannel()
    } catch (err) {
      console.error(err)
    }
  }

  async publish<T extends object>(
    EventType: { exchange: string; routingKey: string },
    message: T
  ) {
    const channel = this.getChannel()
    await channel?.assertExchange(EventType.exchange, 'fanout', { durable: true })
    channel?.publish(
      EventType.exchange,
      EventType.routingKey,
      Buffer.from(JSON.stringify(message))
    )
  }

  getChannel() {
    return this.channel
  }
}
