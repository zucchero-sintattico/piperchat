import { RabbitMQ } from '@commons/rabbit-mq'
import { MongooseUtils } from '@commons/mongoose-utils'
import { MicroserviceConfiguration } from '@commons/microservice-configuration'
import mongoose from 'mongoose'
import { ServiceEvents } from '@commons/events/service-events'
import { NotificationsServer } from './server'
import { NotificationsServiceEventsConfiguration } from './events-configuration'

const start = async (configuration: MicroserviceConfiguration) => {
  // Initialize mongoose
  await MongooseUtils.initialize(mongoose, configuration.mongoUri)

  // Initialize RabbitMQ
  await RabbitMQ.initialize(configuration.amqpUri)

  // Initialize service events listeners
  const eventsConfig = new NotificationsServiceEventsConfiguration()
  await ServiceEvents.initialize(RabbitMQ.getInstance(), eventsConfig)

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
