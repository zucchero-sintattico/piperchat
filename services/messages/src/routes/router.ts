import { Router } from 'express'
import { DirectRouter } from './message-router'
import { ChannelRouter } from './channels-router'

const serviceRouter = Router()
const channelRouter = Router()

// Register all routers
serviceRouter.use('/users', DirectRouter)
channelRouter.use('/servers', ChannelRouter)

export { serviceRouter }
export { channelRouter }
