import { Router } from 'express'
import { serverRouter } from './routers/server-router'
import { channelRouter } from './routers/channel-router'
import { HealthCheckRouter } from '@piperchat/commons'
import { JWTAuthenticationMiddleware } from '@piperchat/commons'

const serviceRouter = Router()
const healthCheckRouter = Router()
serviceRouter.use(JWTAuthenticationMiddleware)

healthCheckRouter.use('/healthcheck', HealthCheckRouter)
// Register all routers
serviceRouter.use('/servers/:serverId/channels', channelRouter)
serviceRouter.use('/servers', serverRouter)

export { serviceRouter }
