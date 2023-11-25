import { DefaultMiddlewares, MicroserviceConfiguration } from '@commons/service'
import { MultimediaServiceEventsConfiguration } from './events-configuration'
import { WebRTCSocketServer } from './webrtc-socket-server'
import http from 'http'
import { serviceRouter } from './routes/router'

const WebRTCService = (server: http.Server) => {
  new WebRTCSocketServer(server)
}

export const MultimediaServiceConfiguration: MicroserviceConfiguration = {
  port: Number.parseInt(process.env.PORT!) || 3000,
  amqpUri: process.env.AMQP_URI || 'amqp://localhost:5672',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/multimedia',
  eventsConfiguration: new MultimediaServiceEventsConfiguration(),
  expressConfiguration: {
    middlewares: DefaultMiddlewares,
    serviceRouter: serviceRouter,
    serverBasedServices: [WebRTCService],
  },
}