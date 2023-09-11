import { Router } from 'express'
import { notificationRouter } from './routers/notification-router'
import { userStatusRouter } from './routers/user-status-router'
import { JWTAuthenticationMiddleware } from '@commons/jwt'
const serviceRouter = Router()
serviceRouter.use(JWTAuthenticationMiddleware)

serviceRouter.use('/notification', notificationRouter)
serviceRouter.use('/users', userStatusRouter)

export { serviceRouter }
