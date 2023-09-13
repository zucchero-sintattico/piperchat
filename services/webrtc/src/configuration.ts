import { DefaultMiddlewares, MicroserviceConfiguration } from '@commons/service'
import { WebRtcServiceEventsConfiguration } from './events-configuration'
import { WebRTCSocketServer } from './webrtc-socket-server'
import http from 'http'
import { serviceRouter } from './routes/router'

const WebRTCService = (server: http.Server) => {
  new WebRTCSocketServer(server)
}

export const WebRtcServiceConfiguration: MicroserviceConfiguration = {
  port: Number.parseInt(process.env.PORT!) || 3000,
  amqpUri: process.env.AMQP_URI || 'amqp://localhost:5672',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/messages',
  eventsConfiguration: new WebRtcServiceEventsConfiguration(),
  expressConfiguration: {
    middlewares: DefaultMiddlewares,
    serviceRouter: serviceRouter,
    serverBasedServices: [WebRTCService],
  },
}
