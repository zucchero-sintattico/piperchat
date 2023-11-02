import { Router } from 'express'
import {
  UserNotFoundException,
  UserStatusController,
  UserStatusControllerImpl,
} from '@controllers/user-status-controller'
import { GetUserStatusApi } from '@api/users/user'
import { Route } from '@commons/route'

const userStatusController: UserStatusController = new UserStatusControllerImpl()

const GetUserStatusApiRoute = new Route<
  GetUserStatusApi.Response,
  GetUserStatusApi.Request.Params,
  GetUserStatusApi.Request.Body
>({
  method: 'get',
  path: '/:username/status',
  schema: GetUserStatusApi.Request.Schema,
  handler: async (req, res) => {
    const status = await userStatusController.getStatus(req.params.username)
    const response = new GetUserStatusApi.Responses.Success({
      online: status.status === 'online',
      lastActive: status.lastActive ?? new Date(0),
    })
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: UserNotFoundException,
      onException(e, req, res) {
        res.sendResponse(new GetUserStatusApi.Errors.UserNotFound())
      },
    },
  ],
})

export const userStatusRouter = Router({
  strict: true,
  mergeParams: true,
})

GetUserStatusApiRoute.attachToRouter(userStatusRouter)
