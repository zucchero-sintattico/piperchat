/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, Router } from 'express'
import {
  UserController,
  UserControllerExceptions,
} from '@controllers/user/user-controller'
import { UserControllerImpl } from '@controllers/user/user-controller-impl'
import { JWTAuthenticationMiddleware } from '@piperchat/commons/src/jwt'

// Import specific interfaces from the API
import { Validate } from '@piperchat/api/src/validate'
import { InternalServerError } from '@piperchat/api/src/errors'
import {
  WhoamiApi,
  GetUserPhotoApi,
  GetUserDescriptionApi,
} from '@piperchat/api/src/users/user'

const userController: UserController = new UserControllerImpl()

export const usersRouter = Router()
usersRouter.use(JWTAuthenticationMiddleware)

usersRouter.get(
  '/whoami',
  Validate(WhoamiApi.Request.Schema),
  async (
    req: Request<WhoamiApi.Request.Params, WhoamiApi.Response, WhoamiApi.Request.Body>,
    res: Response<WhoamiApi.Response | InternalServerError>
  ) => {
    try {
      const user = await userController.getUser(req.user.username)
      const response = new WhoamiApi.Responses.Success(user)
      response.send(res)
    } catch (e) {
      const response = new InternalServerError(e)
      response.send(res)
    }
  }
)

usersRouter.get(
  '/:username/photo',
  async (
    req: Request<
      GetUserPhotoApi.Request.Params,
      GetUserPhotoApi.Response,
      GetUserPhotoApi.Request.Body
    >,
    res: Response<GetUserPhotoApi.Response | InternalServerError>
  ) => {
    try {
      const photo = await userController.getUserPhoto(req.params.username)
      const response = new GetUserPhotoApi.Responses.Success(photo)
      response.send(res)
    } catch (e) {
      if (e instanceof UserControllerExceptions.UserNotFound) {
        const response = new GetUserPhotoApi.Errors.UserNotFound()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

usersRouter.get(
  '/:username/description',
  async (
    req: Request<
      GetUserDescriptionApi.Request.Params,
      GetUserDescriptionApi.Response,
      GetUserDescriptionApi.Request.Body
    >,
    res: Response<GetUserDescriptionApi.Response | InternalServerError>
  ) => {
    try {
      const description = await userController.getUserDescription(req.params.username)
      const response = new GetUserDescriptionApi.Responses.Success(description)
      response.send(res)
    } catch (e) {
      if (e instanceof UserControllerExceptions.UserNotFound) {
        const response = new GetUserDescriptionApi.Errors.UserNotFound()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)
