import { Request, Router, Response } from 'express'
import {
  UserNotFoundException,
  UserStatusController,
  UserStatusControllerImpl,
} from '@controllers/user-status-controller'

import { Validate } from '@piperchat/api/src/validate'
import { InternalServerError } from '@piperchat/api/src/errors'
import { GetUserStatusApi } from '@piperchat/api/src/users/user'

const userStatusController: UserStatusController = new UserStatusControllerImpl()
export const userStatusRouter = Router()

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
