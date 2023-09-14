import { usersRouter } from './routers/user-router'
import { authRouter } from './routers/auth-router'
import { friendsRouter } from './routers/friends-router'
import { profileRouter } from './routers/profile-router'
import { WhoamiApi } from '@api/users/user'
import { UserController } from '@/controllers/user/user-controller'
import { UserControllerImpl } from '@/controllers/user/user-controller-impl'
import { Route } from '@commons/router'
import { Router } from 'express'

const serviceRouter = Router()

serviceRouter.use('/auth', authRouter)
serviceRouter.use('/users', usersRouter)
serviceRouter.use('/friends', friendsRouter)
serviceRouter.use('/profile', profileRouter)

const WhoamiApiRoute = new Route<
  WhoamiApi.Response,
  WhoamiApi.Request.Params,
  WhoamiApi.Request.Body
>({
  method: 'get',
  path: '/whoami',
  schema: WhoamiApi.Request.Schema,
  handler: async (req, res) => {
    const userController: UserController = new UserControllerImpl()
    const user = await userController.getUser(req.user.username)
    const response = new WhoamiApi.Responses.Success({
      username: user.username,
      email: user.email,
    })
    res.sendResponse(response)
  },
})

WhoamiApiRoute.attachToRouter(serviceRouter)

export { serviceRouter }
