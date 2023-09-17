import { DefaultMiddlewares, MicroserviceConfiguration } from '@commons/service'
import { NotificationsServiceEventsConfiguration } from './events-configuration'
import { serviceRouter } from './routes/router'

export const NotificationsServiceConfiguration: MicroserviceConfiguration = {
  port: Number.parseInt(process.env.PORT!) || 3000,
  amqpUri: process.env.AMQP_URI || 'amqp://localhost:5672',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/notifications',
  eventsConfiguration: new NotificationsServiceEventsConfiguration(),
  expressConfiguration: {
    middlewares: DefaultMiddlewares,
    serviceRouter: serviceRouter,
  },
}
