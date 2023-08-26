// exports all src files
export { BasicEventsRepository } from './basic-events-repository'
export { ServiceEventsRepository } from './service-events-repository'
export * from './infra-service-middleware'
export * from './jwt'
export { RabbitMQ } from './rabbit-mq'
export { MongooseUtils } from './mongoose-utils'
export * as Api from './api/api'

export interface MicroserviceConfiguration {
  port: number
  amqpUri: string
  mongoUri: string
}
