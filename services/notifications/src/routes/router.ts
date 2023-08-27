import { Router } from 'express'
import { notificationRouter } from './routers/notification-router'
import { userStatusRouter } from './routers/user-status-router'
const serviceRouter = Router()

serviceRouter.use('/notification', notificationRouter)
serviceRouter.use('/users', userStatusRouter)

export { serviceRouter }
