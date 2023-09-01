import amqp from 'amqplib'

export class RabbitMQ {
  static instance: RabbitMQ

  private connectionUri: string
  private connection: amqp.Connection | undefined
  private channel: amqp.Channel | undefined

  static async initialize(connectionUri: string) {
    console.log('Initializing RabbitMQ')
    if (!RabbitMQ.instance) {
      console.log('RabbitMQ not initialized')
      RabbitMQ.instance = new RabbitMQ(connectionUri)
      console.log('RabbitMQ instance created, connection uri: ' + connectionUri)
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
      throw new Error('RabbitMQ not initialized')
    }
    return RabbitMQ.instance
  }

  private constructor(connectionUri: string) {
    this.connectionUri = connectionUri
  }

  async connect() {
    try {
      console.log('Connecting to RabbitMQ')
      this.connection = await amqp.connect(this.connectionUri)
      console.log('Connected to RabbitMQ')
      this.channel = await this.connection.createChannel()
    } catch (err) {
      console.error(err)
    }
  }

  getChannel() {
    return this.channel
  }
}
