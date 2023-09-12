import { DefaultMiddlewares, MicroserviceConfiguration } from '@commons/service'
import { PiperchatServiceEventsConfiguration } from './events-configuration'
import { serviceRouter } from './routes/router'

export const PiperchatServiceConfiguration: MicroserviceConfiguration = {
  port: Number.parseInt(process.env.PORT!) || 3000,
  amqpUri: process.env.AMQP_URI || 'amqp://localhost:5672',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/messages',
  eventsConfiguration: new PiperchatServiceEventsConfiguration(),
  expressConfiguration: {
    middlewares: DefaultMiddlewares,
    serviceRouter: serviceRouter,
  },
}
