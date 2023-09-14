/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, Router } from 'express'
import {
  UserController,
  UserControllerExceptions,
} from '@controllers/user/user-controller'
import { UserControllerImpl } from '@controllers/user/user-controller-impl'
import { JWTAuthenticationMiddleware } from '@commons/utils/jwt'

// Import specific interfaces from the API
import { InternalServerError } from '@api/errors'
import { GetUserPhotoApi, GetUserDescriptionApi } from '@api/users/user'
import { Validate } from '@api/validate'

const userController: UserController = new UserControllerImpl()

export const usersRouter = Router({
  strict: true,
  mergeParams: true,
})

usersRouter.use(JWTAuthenticationMiddleware)

usersRouter.get(
  '/:username/photo',
  Validate(GetUserPhotoApi.Request.Schema),
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
  Validate(GetUserDescriptionApi.Request.Schema),
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
