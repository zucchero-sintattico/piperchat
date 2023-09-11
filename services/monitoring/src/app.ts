import { RabbitMQ } from '@piperchat/commons/src/rabbit-mq'
import { MongooseUtils } from '@piperchat/commons/src/mongoose-utils'
import { MicroserviceConfiguration } from '@piperchat/commons/src/microservice-configuration'
import mongoose from 'mongoose'
import { MonitoringServer } from './server'
import { ServiceEvents } from './events'

// Start function
const start = async (configuration: MicroserviceConfiguration) => {
  // Initialize mongoose
  await MongooseUtils.initialize(mongoose, configuration.mongoUri)

  // Initialize RabbitMQ
  await RabbitMQ.initialize(configuration.amqpUri)

  // Initialize service events listeners
  await ServiceEvents.initialize()

  const app: MonitoringServer = new MonitoringServer(configuration.port)

  app.start(() => {
    console.log(`Started on port: ${configuration.port}`)
  })
}

// Connections info
const configuration = {
  port: Number.parseInt(process.env['PORT']!) || 3000,
  amqpUri: process.env['AMQP_URI'] || 'amqp://localhost:5672',
  mongoUri: process.env['MONGO_URI'] || 'mongodb://localhost:27017',
}

// Start the service
start(configuration)
