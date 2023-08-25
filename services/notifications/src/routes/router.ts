import { Router } from 'express'
import { notificationRouter } from './routers/notification-router'
import { userStatusRouter } from './routers/user-status-router'
import { healthCheckRouter } from '@piperchat/commons'

const serviceRouter = Router()

serviceRouter.use('/notification', notificationRouter)
serviceRouter.use('/users', userStatusRouter)
serviceRouter.use('/healthcheck', healthCheckRouter)

serviceRouter.get('/', (req, res) => {
  res.sendFile('client.html', { root: __dirname + '/../../' })
})

export { serviceRouter }
