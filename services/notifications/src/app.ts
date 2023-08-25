import { RabbitMQ, MongooseUtils, MicroserviceConfiguration } from '@piperchat/commons'
import mongoose from 'mongoose'
import { ServiceEvents } from '@events/events'
import { NotificationsServer } from './server'

const start = async (configuration: MicroserviceConfiguration) => {
  // Initialize mongoose
  await MongooseUtils.initialize(mongoose, configuration.mongoUri)

  // Initialize RabbitMQ
  await RabbitMQ.initialize(configuration.amqpUri)

  // Initialize service events listeners
  await ServiceEvents.initialize()

  // Express app
  const app: NotificationsServer = new NotificationsServer(configuration.port)

  app.start(() => {
    console.log(`Started on port: ${configuration.port}`)
  })
}

// Connections info
const configuration = {
  port: Number.parseInt(process.env.PORT!) || 3000,
  amqpUri: process.env.AMQP_URI || 'amqp://localhost:5672',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/notifications',
}

// Start the service
start(configuration)
