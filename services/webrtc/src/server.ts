import http from 'http'
import express from 'express'
import { serviceRouter } from './routes/router'
import cookieParser from 'cookie-parser'
import { WebRTCSocketServer } from './webrtc-socket-server'

export class WebRTCServer {
  private port: number
  private app: express.Application
  private webRTCSocketServer: WebRTCSocketServer
  public server: http.Server

  constructor(port: number) {
    this.port = port
    this.app = express()
    this.server = http.createServer(this.app)
    this.webRTCSocketServer = new WebRTCSocketServer(this.server)
    this.setupMiddleware()
    this.setupRouter()
  }
  private setupMiddleware() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
  }

  private setupRouter() {
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
