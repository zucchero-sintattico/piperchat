import http from 'http'
import express from 'express'
import { serviceRouter } from './routes/router'
import cookieParser from 'cookie-parser'
import { HealthCheckService } from './healtcheck-service'

export class MonitoringServer {
  private port: number
  private app: express.Application
  public server: http.Server
  private healthCheckService: HealthCheckService = new HealthCheckService()

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
    this.app.use('/', serviceRouter)
  }

  async start(onStarted: () => void = () => {}) {
    return new Promise<void>((resolve) => {
      this.server.listen(this.port, () => {
        onStarted()
        this.healthCheckService.start()
        resolve()
      })
    })
  }

  stop() {
    this.server.close()
  }
}
