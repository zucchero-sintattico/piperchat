import { DefaultMiddlewares, MicroserviceConfiguration } from '@commons/service'
import { AllEventsListener } from './events'
import { serviceRouter } from './routes/router'

const EventListenerService = {
  start: async () => {
    await AllEventsListener.initialize()
  },
  stop: async () => {},
}

export const MonitoringServiceConfiguration: MicroserviceConfiguration = {
  port: Number.parseInt(process.env.PORT!) || 3000,
  amqpUri: process.env.AMQP_URI || 'amqp://localhost:5672',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/messages',
  expressConfiguration: {
    middlewares: DefaultMiddlewares,
    serviceRouter: serviceRouter,
  },
  otherServices: [EventListenerService],
}
