import { Router } from 'express'
import { infraServiceMiddleware } from '@piperchat/commons'
import { sessionRouter } from './routers/sessionRouter'
import { healthCheckRouter } from '@piperchat/commons'

export const serviceRouter = Router()
serviceRouter.use(infraServiceMiddleware)

serviceRouter.use('/session', sessionRouter)
serviceRouter.use('/healthcheck', healthCheckRouter)
