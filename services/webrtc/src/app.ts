import { RabbitMQ } from '@piperchat/commons/src/rabbit-mq'
import { MongooseUtils } from '@piperchat/commons/src/mongoose-utils'
import { MicroserviceConfiguration } from '@piperchat/commons/src/microservice-configuration'
import mongoose from 'mongoose'
import { ServiceEvents } from '@piperchat/commons/src/events/service-events'
import { WebRTCServer } from './server'
import { WebRtcServiceEventsConfiguration } from './events-configuration'

// Start function
const start = async (configuration: MicroserviceConfiguration) => {
  // Initialize mongoose
  await MongooseUtils.initialize(mongoose, configuration.mongoUri)

  // Initialize RabbitMQ
  await RabbitMQ.initialize(configuration.amqpUri)

  // Initialize service events listeners
  const eventsConfig = new WebRtcServiceEventsConfiguration()
  await ServiceEvents.initialize(RabbitMQ.getInstance(), eventsConfig)

  // Express app
  const app: WebRTCServer = new WebRTCServer(configuration.port)

  app.start(() => {
    console.log(`Started on port: ${configuration.port}`)
  })
}

// Connections info
const configuration = {
  port: Number.parseInt(process.env.PORT!) || 3000,
  amqpUri: process.env.AMQP_URI || 'amqp://localhost:5672',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017',
}

// Start the service
start(configuration)
