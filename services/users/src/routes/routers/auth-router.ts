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
import LoginApi = Api.Users.Login
import RegisterApi = Api.Users.Register
import LogoutApi = Api.Users.Logout
import RefreshTokenApi = Api.Users.RefreshToken

// Define specific types for the requests and responses
namespace Requests {
  export type Login = Request<undefined, undefined, LoginApi.Request>
  export type Register = Request<undefined, undefined, RegisterApi.Request>
  export type Logout = Request<undefined, undefined, LogoutApi.Request>
  export type RefreshToken = Request<undefined, undefined, RefreshTokenApi.Request>
}
namespace Responses {
  export type Login = Response<LoginApi.Response | ApiErrors.InternalServerError>
  export type Register = Response<RegisterApi.Response | ApiErrors.InternalServerError>
  export type Logout = Response<LogoutApi.Response | ApiErrors.InternalServerError>
  export type RefreshToken = Response<
    RefreshTokenApi.Response | ApiErrors.InternalServerError
  >
}

const authController: AuthController = new AuthControllerImpl()

export const authRouter = Router()

authRouter.post('/register', async (req: Requests.Register, res: Responses.Register) => {
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
})

authRouter.post('/login', async (req: Requests.Login, res: Responses.Login) => {
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
})

authRouter
  .use(JWTAuthenticationMiddleware)
  .post('/logout', async (req: Requests.Logout, res: Responses.Logout) => {
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
  })

authRouter
  .use(JWTRefreshTokenMiddleware)
  .post(
    '/refresh-token',
    async (req: Requests.RefreshToken, res: Responses.RefreshToken) => {
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
