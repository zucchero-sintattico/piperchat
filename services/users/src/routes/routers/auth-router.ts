import {
  AuthController,
  AuthControllerExceptions,
} from '@controllers/auth/auth-controller'
import { AuthControllerImpl } from '@controllers/auth/auth-controller-impl'
import {
  JWTAuthenticationMiddleware,
  JWTRefreshTokenMiddleware,
} from '@commons/utils/jwt'
import { Route } from '@commons/route'
import { LoginApi, RegisterApi, LogoutApi, RefreshTokenApi } from '@api/users/auth'
import { Router } from 'express'

const authController: AuthController = new AuthControllerImpl()

export const authRouter = Router()

export const RegisterApiRoute = new Route<
  RegisterApi.Response,
  RegisterApi.Request.Params,
  RegisterApi.Request.Body
>({
  method: 'post',
  path: '/register',
  schema: RegisterApi.Request.Schema,
  handler: async (req, res) => {
    const user = await authController.register(
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.description ?? '',
      req.body.photo
    )
    const response = new RegisterApi.Responses.Success({
      username: user.username,
      email: user.email,
      description: user.description,
      photo: user.profilePicture,
    })
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: AuthControllerExceptions.UserAlreadyExists,
      onException: (e, req, res) => {
        res.sendResponse(new RegisterApi.Errors.UserAlreadyExists())
      },
    },
    {
      exception: AuthControllerExceptions.EmailAlreadyExists,
      onException: (e, req, res) => {
        res.sendResponse(new RegisterApi.Errors.EmailAlreadyExists())
      },
    },
  ],
})

export const LoginApiRoute = new Route<
  LoginApi.Response,
  LoginApi.Request.Params,
  LoginApi.Request.Body
>({
  method: 'post',
  path: '/login',
  schema: LoginApi.Request.Schema,
  handler: async (req, res) => {
    const token = await authController.login(req.body.username, req.body.password)
    res.sendResponse(new LoginApi.Responses.Success(token))
  },
  exceptions: [
    {
      exception: AuthControllerExceptions.InvalidUsernameOrPassword,
      onException: (e, req, res) => {
        res.sendResponse(new LoginApi.Errors.UsernameOrPasswordIncorrect())
      },
    },
  ],
})

export const LogoutApiRoute = new Route<
  LogoutApi.Response,
  LogoutApi.Request.Params,
  LogoutApi.Request.Body
>({
  method: 'post',
  path: '/logout',
  schema: LogoutApi.Request.Schema,
  middlewares: [JWTAuthenticationMiddleware],
  handler: async (req, res) => {
    try {
      await authController.logout(req.user.username)
    } catch (e) {
      console.log(e)
    }
    //await authController.logout(req.user.username)
    res.sendResponse(new LogoutApi.Responses.Success())
  },
  exceptions: [
    {
      exception: AuthControllerExceptions.UserNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new LogoutApi.Errors.UserNotFound())
      },
    },
  ],
})

export const RefreshTokenApiRoute = new Route<
  RefreshTokenApi.Response,
  RefreshTokenApi.Request.Params,
  RefreshTokenApi.Request.Body
>({
  method: 'post',
  path: '/refresh-token',
  schema: RefreshTokenApi.Request.Schema,
  middlewares: [JWTRefreshTokenMiddleware],
  handler: async (req, res) => {
    const token = await authController.refreshToken(req.user.username)
    res.sendResponse(new RefreshTokenApi.Responses.Success(token))
  },
  exceptions: [
    {
      exception: AuthControllerExceptions.UserNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new RefreshTokenApi.Errors.UserNotFound())
      },
    },
    {
      exception: AuthControllerExceptions.InvalidRefreshToken,
      onException: (e, req, res) => {
        res.sendResponse(new RefreshTokenApi.Errors.InvalidRefreshToken())
      },
    },
    {
      exception: AuthControllerExceptions.RefreshTokenNotPresent,
      onException: (e, req, res) => {
        res.sendResponse(new RefreshTokenApi.Errors.InvalidRefreshToken())
      },
    },
  ],
})

RegisterApiRoute.attachToRouter(authRouter)
LoginApiRoute.attachToRouter(authRouter)
LogoutApiRoute.attachToRouter(authRouter)
RefreshTokenApiRoute.attachToRouter(authRouter)
