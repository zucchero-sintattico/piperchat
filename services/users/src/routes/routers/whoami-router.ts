import { UserController } from '@/controllers/user/user-controller'
import { UserControllerImpl } from '@/controllers/user/user-controller-impl'
import { WhoamiApi } from '@api/users/user'
import { Route } from '@commons/router'
import { Router } from 'express'

const userController: UserController = new UserControllerImpl()

const WhoamiApiRoute = new Route<
  WhoamiApi.Response,
  WhoamiApi.Request.Params,
  WhoamiApi.Request.Body
>({
  method: 'get',
  path: '/',
  schema: WhoamiApi.Request.Schema,
  handler: async (req, res) => {
    const user = await userController.getUser(req.user.username)
    const response = new WhoamiApi.Responses.Success({
      username: user.username,
      email: user.email,
    })
    res.sendResponse(response)
  },
})

export const whoamiRouter = Router()
WhoamiApiRoute.attachToRouter(whoamiRouter)
