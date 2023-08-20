import { Request, Router, Response } from 'express'
import {
  UserStatusController,
  UserStatusControllerImpl,
} from '@controllers/user-status-controller'
import { JWTAuthenticationMiddleware } from '@piperchat/commons'

const userStatusController: UserStatusController = new UserStatusControllerImpl()

export const userStatusRouter = Router()

userStatusRouter.use(JWTAuthenticationMiddleware)

userStatusRouter.get('/:username/status', async (req: Request, res: Response) => {
  try {
    const user = await userStatusController.getStatus(req.params.username)
    if (user?.status === 'online') {
      res.status(200).json({ status: 'online' })
    } else {
      res.status(200).json({ status: 'offline', lastActive: user.lastActive })
    }
  } catch (e: any) {
    res.status(404).json({ error: 'User not found' })
  }
})
