/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, Router } from 'express'
import {
  UserController,
  UserControllerExceptions,
} from '@controllers/user/user-controller'
import { UserControllerImpl } from '@controllers/user/user-controller-impl'
import { Api, JWTAuthenticationMiddleware } from '@piperchat/commons'

// Import specific interfaces from the API
import ApiErrors = Api.Errors
import WhoamiApi = Api.Users.User.Whoami
import GetUserStatusApi = Api.Users.User.GetUserStatus
import GetUserPhotoApi = Api.Users.User.GetUserPhoto
import GetUserDescriptionApi = Api.Users.User.GetUserDescription

const userController: UserController = new UserControllerImpl()

export const usersRouter = Router()
usersRouter.use(JWTAuthenticationMiddleware)

usersRouter.get(
  '/whoami',
  async (
    req: Request<
      WhoamiApi.Request.Params,
      WhoamiApi.Response,
      WhoamiApi.Request.Body,
      WhoamiApi.Request.Query
    >,
    res: Response<WhoamiApi.Response | ApiErrors.InternalServerError>
  ) => {
    try {
      const user = await userController.getUser(req.user.username)
      const response = new WhoamiApi.Responses.Success(user)
      response.send(res)
    } catch (e) {
      const response = new ApiErrors.InternalServerError(e)
      response.send(res)
    }
  }
)

usersRouter.get(
  '/:username/status',
  async (
    req: Request<
      GetUserStatusApi.Request.Params,
      GetUserStatusApi.Response,
      GetUserStatusApi.Request.Body,
      GetUserStatusApi.Request.Query
    >,
    res: Response<GetUserStatusApi.Response | ApiErrors.InternalServerError>
  ) => {
    try {
      const status = await userController.getUserStatus(req.params.username)
      const response = new GetUserStatusApi.Responses.Success(status)
      response.send(res)
    } catch (e) {
      if (e instanceof UserControllerExceptions.UserNotFound) {
        const response = new GetUserStatusApi.Errors.UserNotFound()
        response.send(res)
      } else {
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)

usersRouter.get(
  '/:username/photo',
  async (
    req: Request<
      GetUserPhotoApi.Request.Params,
      GetUserPhotoApi.Response,
      GetUserPhotoApi.Request.Body,
      GetUserPhotoApi.Request.Query
    >,
    res: Response<GetUserPhotoApi.Response | ApiErrors.InternalServerError>
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
        const response = new ApiErrors.InternalServerError(e)
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
      GetUserDescriptionApi.Request.Body,
      GetUserDescriptionApi.Request.Query
    >,
    res: Response<GetUserDescriptionApi.Response | ApiErrors.InternalServerError>
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
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)
