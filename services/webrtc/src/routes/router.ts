import { Router } from 'express'
import { infraServiceMiddleware } from '@commons/infra-service/infra-service-middleware'
import { sessionRouter } from './routers/sessionRouter'

export const serviceRouter = Router()
serviceRouter.use(infraServiceMiddleware)

serviceRouter.use('/session', sessionRouter)
