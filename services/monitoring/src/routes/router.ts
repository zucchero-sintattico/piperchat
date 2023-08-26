import { Router } from 'express'
import { monitoringUserRouter } from './monitoring-user-router'

const serviceRouter = Router()

// Register all routers
serviceRouter.use('/users', monitoringUserRouter)
serviceRouter.use('/messages', monitoringUserRouter)

export { serviceRouter }
