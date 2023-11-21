import { Empty, ErrorResponse, Response } from '../response'
import { EmptySchema, RequestSchema } from '../schema'
import { UpdatePhotoApi } from './profile'

/**
 * Whoami endpoint
 */
export module WhoamiApi {
  export module Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = Empty
    export const Schema: RequestSchema = EmptySchema
  }
  export module Responses {
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
export module GetUserStatusApi {
  export module Request {
    export type Type = Body & Params
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
  export module Responses {
    export type UserStatusInfo = {
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
  export module Errors {
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
export module GetUserPhotoApi {
  export module Request {
    export type Type = Body & Params
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
  export module Responses {
    export class Success extends Response {
      statusCode = 200
      photo: UpdatePhotoApi.Photo
      constructor(photo: UpdatePhotoApi.Photo) {
        super()
        this.photo = photo
      }
    }
    export type Type = Success
  }
  export module Errors {
    export class UserNotFound extends ErrorResponse {
      statusCode = 404
      error = 'User not found' as const
    }
    export type Type = UserNotFound
  }
  export type Response = Responses.Type | Errors.Type
}

/**
 * Get user description
 */
export module GetUserDescriptionApi {
  export module Request {
    export type Type = Body & Params
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
  export module Responses {
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
  export module Errors {
    export class UserNotFound extends ErrorResponse {
      statusCode = 404
      error = 'User not found' as const
    }
    export type Type = UserNotFound
  }
  export type Response = Responses.Type | Errors.Type
}
