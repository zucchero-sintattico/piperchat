import { Router } from 'express'
import { monitoringRouter } from './monitoring-router'

const serviceRouter = Router()

// Register all routers
serviceRouter.use('/health', monitoringRouter)

export { serviceRouter }
