/* eslint-disable @typescript-eslint/no-namespace */
import { Empty, ErrorResponse, Response } from '@/api/response'
import { EmptySchema, RequestSchema } from '../schema'

/**
 * Whoami endpoint
 */
export namespace Whoami {
  export namespace Request {
    export type Params = Empty
    export type Body = Empty
    export const Schema: RequestSchema = EmptySchema
  }
  export namespace Responses {
    interface WhoamiUser {
      username: string
      email: string
    }

    export class Success extends Response {
      statusCode = 200
      user: WhoamiUser
      constructor(user: WhoamiUser) {
        super()
        this.user = user
      }
    }
    export type Type = Success
  }
  export type Response = Responses.Type
}

/**
 * Get user status
 */
export namespace GetUserStatus {
  export namespace Request {
    export type Params = {
      username: string
    }
    export type Body = Empty
    export const Schema: RequestSchema = {
      Params: {
        username: 'string',
      },
      Body: {},
    }
  }
  export namespace Responses {
    type UserStatusInfo = {
      online: boolean
      lastActive: Date
    }

    export class Success extends Response {
      statusCode = 200
      status: UserStatusInfo
      constructor(status: UserStatusInfo) {
        super()
        this.status = status
      }
    }

    export type Type = Success
  }
  export namespace Errors {
    export class UserNotFound extends ErrorResponse {
      statusCode = 404
      error = 'User not found' as const
    }
    export type Type = UserNotFound
  }
  export type Response = Responses.Type | Errors.Type
}

/**
 * Get user photo
 */
export namespace GetUserPhoto {
  export namespace Request {
    export type Params = {
      username: string
    }
    export type Body = Empty
    export const Schema: RequestSchema = {
      Params: {
        username: 'string',
      },
      Body: {},
    }
  }
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      photo: Buffer
      constructor(photo: Buffer) {
        super()
        this.photo = photo
      }
    }
    export type Type = Success
  }
  export namespace Errors {
    export class UserNotFound extends ErrorResponse {
      statusCode = 404
      error = 'User not found' as const
    }
    export type Type = Error
  }
  export type Response = Responses.Type | Errors.Type
}

/**
 * Get user description
 */
export namespace GetUserDescription {
  export namespace Request {
    export type Params = {
      username: string
    }
    export type Body = Empty
    export const Schema: RequestSchema = {
      Params: {
        username: 'string',
      },
      Body: {},
    }
  }
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      description: string
      constructor(description: string) {
        super()
        this.description = description
      }
    }
    export type Type = Success
  }
  export namespace Errors {
    export class UserNotFound extends ErrorResponse {
      statusCode = 404
      error = 'User not found' as const
    }
    export type Type = UserNotFound
  }
  export type Response = Responses.Type | Errors.Type
}
