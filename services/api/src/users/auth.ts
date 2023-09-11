/* eslint-disable @typescript-eslint/no-namespace */
import { Empty, ErrorResponse, Response, ResponseFacade } from '../response'
import { RequestSchema, EmptySchema } from '../schema'

/**
 * Register endpoint
 */
export namespace RegisterApi {
  export namespace Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = {
      username: string
      password: string
      email: string
      description?: string
      photo?: Buffer
    }
    export const Schema: RequestSchema = {
      Params: {},
      Body: {
        username: 'string',
        password: 'string',
        email: 'string',
        description: 'string?',
        photo: 'Buffer?',
      },
    }
  }

  export namespace Responses {
    interface UserLoginResponse {
      username: string
      email: string
      description?: string
      photo?: Buffer
    }

    export class Success extends Response {
      statusCode = 200
      createdUser: UserLoginResponse
      constructor(user: UserLoginResponse) {
        super()
        this.createdUser = user
      }
    }

    export type Type = Success
  }

  export namespace Errors {
    export class UserAlreadyExists extends ErrorResponse {
      statusCode = 409
      error = 'User already exists' as const
    }

    export type Type = UserAlreadyExists
  }

  export type Response = Responses.Type | Errors.Type
}

/**
 * Login endpoint
 */
export namespace LoginApi {
  export namespace Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = {
      username: string
      password: string
    }
    export const Schema: RequestSchema = {
      Params: {},
      Body: {
        username: 'string',
        password: 'string',
      },
    }
  }

  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Logged in' as const
      jwt: string
      constructor(jwt: string) {
        super()
        this.jwt = jwt
      }
      override send(res: ResponseFacade) {
        res.cookie('jwt', this.jwt, { httpOnly: true })
        super.send(res)
      }
    }

    export type Type = Success
  }

  export namespace Errors {
    export class UsernameOrPasswordIncorrect extends ErrorResponse {
      statusCode = 401
      error = 'Username or password incorrect' as const
    }
    export type Type = UsernameOrPasswordIncorrect
  }

  export type Response = Responses.Type | Errors.Type
}

/**
 * Logout endpoint
 */
export namespace LogoutApi {
  export namespace Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = Empty
    export const Schema = EmptySchema
  }
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Logged out' as const
      override send(res: ResponseFacade) {
        res.clearCookie('jwt')
        super.send(res)
      }
    }

    export type Type = Success
  }
  export namespace Errors {
    export class UserNotFound extends ErrorResponse {
      statusCode = 404
      error = 'User not found' as const
    }
    export class NotLoggedIn extends ErrorResponse {
      statusCode = 401
      error = 'User not logged in' as const
    }
    export type Type = UserNotFound | NotLoggedIn
  }
  export type Response = Responses.Type | Errors.Type
}

/**
 * Refresh token endpoint
 */
export namespace RefreshTokenApi {
  export namespace Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = Empty
    export const Schema = EmptySchema
  }
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Refreshed token' as const
      jwt: string
      constructor(jwt: string) {
        super()
        this.jwt = jwt
      }
      override send(res: ResponseFacade) {
        res.cookie('jwt', this.jwt, { httpOnly: true })
        super.send(res)
      }
    }
    export type Type = Success
  }
  export namespace Errors {
    export class UserNotFound extends ErrorResponse {
      statusCode = 404
      error = 'User not found' as const
    }
    export class InvalidRefreshToken extends ErrorResponse {
      statusCode = 401
      error = 'Invalid refresh token' as const
    }
    export class RefreshTokenNotPresent extends ErrorResponse {
      statusCode = 401
      error = 'Refresh token not present' as const
    }
    export type Type = UserNotFound | InvalidRefreshToken | RefreshTokenNotPresent
  }
  export type Response = Responses.Type | Errors.Type
}
