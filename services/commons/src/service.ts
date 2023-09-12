import express from 'express'
import http from 'http'
import { healthCheckRouter } from './healthcheck/router'
import mongoose from 'mongoose'
import { MongooseUtils } from './utils/mongoose'
import { RabbitMQ } from './utils/rabbit-mq'
import { EventsConfiguration } from './events/events-configuration'
import { ServiceEvents } from './events/service-events'
import cookieParser from 'cookie-parser'

type GeneralService = {
  start: () => Promise<void>
  stop: () => Promise<void>
}
type ServiceWithServer = (server: http.Server) => void

interface ExpressConfiguration {
  middlewares: express.RequestHandler[]
  serviceRouter: express.Router
  serverBasedServices?: ServiceWithServer[]
}

export interface MicroserviceConfiguration {
  port: number
  amqpUri: string
  mongoUri: string
  expressConfiguration: ExpressConfiguration
  eventsConfiguration?: EventsConfiguration
  otherServices?: GeneralService[]
}

class ExpressService {
  private port: number
  private middlewares: express.RequestHandler[]
  private serviceRouter: express.Router
  private otherServices?: ServiceWithServer[]
  private services?: GeneralService[]
  public server?: http.Server
  constructor(port: number, config: ExpressConfiguration) {
    this.port = port
    this.middlewares = config.middlewares
    this.serviceRouter = config.serviceRouter
    this.otherServices = config.serverBasedServices
  }

  async start(onStarted: () => void = () => {}) {
    return new Promise<void>((resolve) => {
      const app = express()
      app.use(...this.middlewares)
      app.use('/', healthCheckRouter)
      app.use('/', this.serviceRouter)
      this.server = http.createServer(app)
      this.otherServices?.forEach((service) => {
        service(this.server!)
      })
      this.server.listen(this.port, () => {
        onStarted()
        resolve()
      })
    })
  }

  async stop() {
    return new Promise<void>((resolve) => {
      if (this.server) {
        this.server.close(() => {
          resolve()
        })
      } else {
        resolve()
      }
    })
  }
}

export class Microservice {
  private configuration: MicroserviceConfiguration
  private app?: ExpressService

  constructor(configuration: MicroserviceConfiguration) {
    this.configuration = configuration
  }

  getServer(): http.Server {
    return this.app!.server!
  }

  async clearDatabase(): Promise<void> {
    await MongooseUtils.clear(mongoose)
  }

  async start(): Promise<void> {
    await MongooseUtils.initialize(mongoose, this.configuration.mongoUri)
    await RabbitMQ.initialize(this.configuration.amqpUri)
    if (this.configuration.eventsConfiguration) {
      await ServiceEvents.initialize(
        RabbitMQ.getInstance(),
        this.configuration.eventsConfiguration
      )
    }
    for (const service of this.configuration.otherServices || []) {
      await service.start()
    }
    this.app = new ExpressService(
      this.configuration.port,
      this.configuration.expressConfiguration
    )
    await this.app.start(() => {
      console.log(`Started on port: ${this.configuration.port}`)
    })
  }
  async stop(): Promise<void> {
    await this.app?.stop()
    await MongooseUtils.close(mongoose)
    await RabbitMQ.disconnect()
    for (const service of this.configuration.otherServices || []) {
      await service.stop()
    }
  }
}

export const EmptyRouter = express.Router()
export const DefaultMiddlewares = [
  express.json(),
  express.urlencoded({ extended: true }),
  cookieParser(),
]
