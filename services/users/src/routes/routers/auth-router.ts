/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Router, Response } from 'express'
import {
  AuthController,
  AuthControllerExceptions,
} from '@controllers/auth/auth-controller'
import { AuthControllerImpl } from '@controllers/auth/auth-controller-impl'
import {
  Api,
  JWTAuthenticationMiddleware,
  JWTRefreshTokenMiddleware,
} from '@piperchat/commons'

// Import specific interfaces from the API
import ApiErrors = Api.Errors
import LoginApi = Api.Users.Auth.Login
import RegisterApi = Api.Users.Auth.Register
import LogoutApi = Api.Users.Auth.Logout
import RefreshTokenApi = Api.Users.Auth.RefreshToken

const authController: AuthController = new AuthControllerImpl()

export const authRouter = Router({
  strict: true,
})

authRouter.post(
  '/register',
  async (
    req: Request<
      RegisterApi.Request.Params,
      RegisterApi.Response,
      RegisterApi.Request.Body,
      RegisterApi.Request.Query
    >,
    res: Response<RegisterApi.Response | ApiErrors.InternalServerError>
  ) => {
    try {
      const user = await authController.register(
        req.body.username,
        req.body.email,
        req.body.password,
        req.body.description ?? '',
        req.body.photo ?? null
      )
      const response = new RegisterApi.Responses.Success(user)
      return response.send(res)
    } catch (e) {
      if (e instanceof AuthControllerExceptions.UserAlreadyExists) {
        const response = new RegisterApi.Errors.UserAlreadyExists()
        response.send(res)
      } else {
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)

authRouter.post(
  '/login',
  async (
    req: Request<
      LoginApi.Request.Params,
      LoginApi.Response,
      LoginApi.Request.Body,
      LoginApi.Request.Query
    >,
    res: Response<LoginApi.Response | ApiErrors.InternalServerError>
  ) => {
    try {
      const token = await authController.login(req.body.username, req.body.password)
      const response = new LoginApi.Responses.Success(token)
      response.send(res)
    } catch (e) {
      if (e instanceof AuthControllerExceptions.InvalidUsernameOrPassword) {
        const response = new LoginApi.Errors.UsernameOrPasswordIncorrect()
        response.send(res)
      } else {
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)

authRouter
  .use(JWTAuthenticationMiddleware)
  .post(
    '/logout',
    async (
      req: Request<
        LogoutApi.Request.Params,
        LogoutApi.Response,
        LogoutApi.Request.Body,
        LogoutApi.Request.Query
      >,
      res: Response<LogoutApi.Response | ApiErrors.InternalServerError>
    ) => {
      try {
        if (!req.user) {
          const response = new LogoutApi.Errors.NotLoggedIn()
          response.send(res)
        }
        await authController.logout(req.user.username)
        const response = new LogoutApi.Responses.Success()
        response.send(res)
      } catch (e) {
        if (e instanceof AuthControllerExceptions.UserNotFound) {
          const response = new LogoutApi.Errors.UserNotFound()
          response.send(res)
        } else {
          const response = new ApiErrors.InternalServerError(e)
          response.send(res)
        }
      }
    }
  )

authRouter
  .use(JWTRefreshTokenMiddleware)
  .post(
    '/refresh-token',
    async (
      req: Request<
        RefreshTokenApi.Request.Params,
        RefreshTokenApi.Response,
        RefreshTokenApi.Request.Body,
        RefreshTokenApi.Request.Query
      >,
      res: Response<RefreshTokenApi.Response | ApiErrors.InternalServerError>
    ) => {
      try {
        const token = await authController.refreshToken(req.user.username)
        const response = new RefreshTokenApi.Responses.Success(token)
        response.send(res)
      } catch (e) {
        if (e instanceof AuthControllerExceptions.UserNotFound) {
          const response = new RefreshTokenApi.Errors.UserNotFound()
          response.send(res)
        } else if (e instanceof AuthControllerExceptions.InvalidRefreshToken) {
          const response = new RefreshTokenApi.Errors.InvalidRefreshToken()
          response.send(res)
        } else if (e instanceof AuthControllerExceptions.RefreshTokenNotPresent) {
          const response = new RefreshTokenApi.Errors.RefreshTokenNotPresent()
          response.send(res)
        } else {
          const response = new ApiErrors.InternalServerError(e)
          response.send(res)
        }
      }
    }
  )
