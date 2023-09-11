import http from 'http'
import express from 'express'
import { serviceRouter } from './routes/router'
import { healthCheckRouter } from '@piperchat/commons/src/healthcheck-router'
import cookieParser from 'cookie-parser'

export class NotificationsServer {
  private port: number
  private app: express.Application
  public server: http.Server

  constructor(port: number) {
    this.port = port
    this.app = express()
    this.server = http.createServer(this.app)
    this.setupMiddleware()
    this.setupRouter()
  }

  private setupMiddleware() {
    this.app.use(express.json())
    this.app.use(cookieParser())
  }

  private setupRouter() {
    this.app.use('/health', healthCheckRouter)
    this.app.use('/', serviceRouter)
  }

  async start(onStarted: () => void = () => {}) {
    return new Promise<void>((resolve) => {
      this.server.listen(this.port, () => {
        onStarted()
        resolve()
      })
    })
  }

  stop() {
    this.server.close()
  }
}
