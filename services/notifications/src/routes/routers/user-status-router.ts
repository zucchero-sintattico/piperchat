import { Request, Router, Response } from 'express'
import {
  UserNotFoundException,
  UserStatusController,
  UserStatusControllerImpl,
} from '@controllers/user-status-controller'

import { Validate } from '@api/validate'
import { InternalServerError } from '@api/errors'
import { GetUserStatusApi } from '@api/users/user'

const userStatusController: UserStatusController = new UserStatusControllerImpl()
export const userStatusRouter = Router({
  strict: true,
  mergeParams: true,
})

userStatusRouter.get(
  '/:username/status',
  Validate(GetUserStatusApi.Request.Schema),
  async (
    req: Request<
      GetUserStatusApi.Request.Params,
      GetUserStatusApi.Response,
      GetUserStatusApi.Request.Body
    >,
    res: Response<GetUserStatusApi.Response | InternalServerError>
  ) => {
    try {
      const status = await userStatusController.getStatus(req.params.username)
      const response = new GetUserStatusApi.Responses.Success({
        online: status.status === 'online',
        lastActive: status.lastActive ?? new Date(0),
      })
      response.send(res)
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        const response = new GetUserStatusApi.Errors.UserNotFound()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)
