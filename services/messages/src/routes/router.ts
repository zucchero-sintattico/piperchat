import { Router } from 'express'
import { directRouter } from './direct-router'
import { channelRouter } from './channels-router'
import { JWTAuthenticationMiddleware } from '@piperchat/commons'

const serviceRouter = Router()
serviceRouter.use(JWTAuthenticationMiddleware)

// Register all routers
serviceRouter.use('/users', directRouter)
serviceRouter.use('/servers', channelRouter)

export { serviceRouter }
