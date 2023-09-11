import { Request, Router, Response } from 'express'
import {
  NotificationController,
  NotificationControllerImpl,
} from '@controllers/notification-controller'
import { ClientProxy } from '@models/client-proxy'

const notificationController: NotificationController = new NotificationControllerImpl()

export const notificationRouter = Router()

notificationRouter.get('/', async (req: Request, res: Response) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  }
  res.writeHead(200, headers)

  req.on('close', () => {
    notificationController.unsubscribe(req.user.username)
  })

  const clientProxy = new ClientProxy(res)
  notificationController.subscribe(req.user.username, clientProxy)
})
