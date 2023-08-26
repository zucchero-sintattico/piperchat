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
import Errors = Api.ErrorsResponses
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
  export type Login = Response<LoginApi.Response | Errors.InternalServerError>
  export type Register = Response<RegisterApi.Response | Errors.InternalServerError>
  export type Logout = Response<LogoutApi.Response | Errors.InternalServerError>
  export type RefreshToken = Response<
    RefreshTokenApi.Response | Errors.InternalServerError
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
    return res.status(200).json(new RegisterApi.Responses.Success(user))
  } catch (e) {
    if (e instanceof AuthControllerExceptions.UserAlreadyExists) {
      return res.status(409).json(new RegisterApi.Errors.UserAlreadyExists())
    } else {
      return res.status(500).json(new Errors.InternalServerError(e))
    }
  }
})

authRouter.post('/login', async (req: Requests.Login, res: Responses.Login) => {
  try {
    const token = await authController.login(req.body.username, req.body.password)
    res.cookie('jwt', token, { httpOnly: true })
    return res.status(200).json(new LoginApi.Responses.Success())
  } catch (e) {
    if (e instanceof AuthControllerExceptions.InvalidUsernameOrPassword) {
      return res.status(401).json(new LoginApi.Errors.UsernameOrPasswordIncorrect())
    } else {
      return res.status(500).json(new Errors.InternalServerError(e))
    }
  }
})

authRouter
  .use(JWTAuthenticationMiddleware)
  .post('/logout', async (req: Requests.Logout, res: Responses.Logout) => {
    try {
      if (!req.user) {
        return res.status(401).json(new LogoutApi.Errors.NotLoggedIn())
      }
      await authController.logout(req.user.username)
      res.clearCookie('jwt')
      return res.status(200).json(new LogoutApi.Responses.Success())
    } catch (e) {
      if (e instanceof AuthControllerExceptions.UserNotFound) {
        return res.status(404).json(new LogoutApi.Errors.UserNotFound())
      } else {
        return res.status(500).json(new Errors.InternalServerError(e))
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
        return res
          .status(200)
          .cookie('jwt', token, { httpOnly: true })
          .json(new RefreshTokenApi.Responses.Success())
      } catch (e) {
        if (e instanceof AuthControllerExceptions.UserNotFound) {
          return res.status(404).json(new RefreshTokenApi.Errors.UserNotFound())
        } else if (e instanceof AuthControllerExceptions.InvalidRefreshToken) {
          return res.status(401).json(new RefreshTokenApi.Errors.InvalidRefreshToken())
        } else if (e instanceof AuthControllerExceptions.RefreshTokenNotPresent) {
          return res.status(401).json(new RefreshTokenApi.Errors.InvalidRefreshToken())
        } else {
          return res.status(500).json(new Errors.InternalServerError(e))
        }
      }
    }
  )
