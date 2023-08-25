import { Router } from 'express'
import { directRouter } from './message-router'
import { channelRouter } from './channels-router'
import { healthCheckRouter } from '@piperchat/commons'

const serviceRouter = Router()

// Register all routers
serviceRouter.use('/users', directRouter)
serviceRouter.use('/servers', channelRouter)
serviceRouter.use('/healthcheck', healthCheckRouter)

export { serviceRouter }
