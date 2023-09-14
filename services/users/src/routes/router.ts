import { Request, Response, Router } from 'express'
import { usersRouter } from './routers/user-router'
import { authRouter } from './routers/auth-router'
import { friendsRouter } from './routers/friends-router'
import { profileRouter } from './routers/profile-router'
import { Validate } from '@api/validate'
import { WhoamiApi } from '@api/users/user'
import { InternalServerError } from '@api/errors'
import { UserController } from '@/controllers/user/user-controller'
import { UserControllerImpl } from '@/controllers/user/user-controller-impl'

const serviceRouter = Router()

serviceRouter.use('/auth', authRouter)
serviceRouter.use('/users', usersRouter)
serviceRouter.use('/friends', friendsRouter)
serviceRouter.use('/profile', profileRouter)

serviceRouter.get(
  '/whoami',
  Validate(WhoamiApi.Request.Schema),
  async (
    req: Request<WhoamiApi.Request.Params, WhoamiApi.Response, WhoamiApi.Request.Body>,
    res: Response<WhoamiApi.Response | InternalServerError>
  ) => {
    try {
      const userController: UserController = new UserControllerImpl()
      const user = await userController.getUser(req.user.username)
      const response = new WhoamiApi.Responses.Success({
        username: user.username,
        email: user.email,
      })
      response.send(res)
    } catch (e) {
      const response = new InternalServerError(e)
      response.send(res)
    }
  }
)

export { serviceRouter }
