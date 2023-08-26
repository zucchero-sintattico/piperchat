import { Router } from 'express'
import { directRouter } from './message-router'
import { channelRouter } from './channels-router'

const serviceRouter = Router()

// Register all routers
serviceRouter.use('/users', directRouter)
serviceRouter.use('/servers', channelRouter)

export { serviceRouter }
