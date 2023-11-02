import { Router } from 'express'
import { userStatusRouter } from './routers/user-status-router'
import { JWTAuthenticationMiddleware } from '@commons/utils/jwt'
const serviceRouter = Router()
serviceRouter.use(JWTAuthenticationMiddleware)

serviceRouter.use('/users', userStatusRouter)

export { serviceRouter }
