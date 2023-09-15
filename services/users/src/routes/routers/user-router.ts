import {
  UserController,
  UserControllerExceptions,
} from '@controllers/user/user-controller'
import { UserControllerImpl } from '@controllers/user/user-controller-impl'
import { GetUserPhotoApi, GetUserDescriptionApi } from '@api/users/user'
import { Route } from '@commons/router'
import { Router } from 'express'
import { JWTAuthenticationMiddleware } from '@commons/utils/jwt'

const userController: UserController = new UserControllerImpl()

export const GetUserPhotoApiRoute = new Route<
  GetUserPhotoApi.Response,
  GetUserPhotoApi.Request.Params,
  GetUserPhotoApi.Request.Body
>({
  method: 'get',
  path: '/:username/photo',
  schema: GetUserPhotoApi.Request.Schema,
  handler: async (req, res) => {
    const photo = await userController.getUserPhoto(req.params.username)
    const response = new GetUserPhotoApi.Responses.Success(photo)
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: UserControllerExceptions.UserNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new GetUserPhotoApi.Errors.UserNotFound())
      },
    },
  ],
})

export const GetUserDescriptionApiRoute = new Route<
  GetUserDescriptionApi.Response,
  GetUserDescriptionApi.Request.Params,
  GetUserDescriptionApi.Request.Body
>({
  method: 'get',
  path: '/:username/description',
  schema: GetUserDescriptionApi.Request.Schema,
  handler: async (req, res) => {
    const description = await userController.getUserDescription(req.params.username)
    const response = new GetUserDescriptionApi.Responses.Success(description)
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: UserControllerExceptions.UserNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new GetUserDescriptionApi.Errors.UserNotFound())
      },
    },
  ],
})

export const usersRouter = Router()
usersRouter.use(JWTAuthenticationMiddleware)
GetUserPhotoApiRoute.attachToRouter(usersRouter)
GetUserDescriptionApiRoute.attachToRouter(usersRouter)
