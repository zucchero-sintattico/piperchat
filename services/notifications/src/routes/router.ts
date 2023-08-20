import { Router } from 'express'
import { notificationRouter } from './routers/notification-router'
import { userStatusRouter } from './routers/user-status-router'

const serviceRouter = Router()

serviceRouter.use('/notification', notificationRouter)
serviceRouter.use('/users', userStatusRouter)

serviceRouter.get('/', (req, res) => {
  res.sendFile('client.html', { root: __dirname + '/../../' })
})

export { serviceRouter }
