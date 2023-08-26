import http from 'http'
import express from 'express'
import { serviceRouter } from './routes/router'
import { healthCheckRouter } from '@piperchat/commons'
import cookieParser from 'cookie-parser'
import cors from 'cors'

export class UsersServer {
  private port: number
  private app: express.Application
  public server: http.Server

  constructor(port: number) {
    this.port = port
    this.app = express()
    const corsOptions = {
      origin: 'http://localhost:5173',
      credentials: true,
    }
    this.app.use(cors(corsOptions))
    this.app.use(express.json())
    this.server = http.createServer(this.app)
    this.setupMiddleware()
    this.setupRouter()
  }

  private setupMiddleware() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
  }

  private setupRouter() {
    this.app.use('/health', healthCheckRouter)
    this.app.use('/', serviceRouter)
  }

  async start(onStarted: () => void = () => {}) {
    return new Promise<void>((resolve, reject) => {
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
