import { Router } from 'express'
import { DirectRouter } from './message-router'
import { ChannelRouter } from './channels-router'
import { HealthCheckRouter } from '@piperchat/commons'

const serviceRouter = Router()
const channelRouter = Router()
const healthCheckRouter = Router()

// Register all routers
serviceRouter.use('/users', DirectRouter)
channelRouter.use('/servers', ChannelRouter)
healthCheckRouter.use('/healthcheck', HealthCheckRouter)

export { serviceRouter }
export { channelRouter }
