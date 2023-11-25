import { Empty, Response } from '../response'
import { RequestSchema } from '../schema'
/* eslint-disable @typescript-eslint/no-namespace */

/**
 * Update photo endpoint
 */
export module UpdatePhotoApi {
  export type Photo = {
    data: Buffer
    contentType: string
  }
  export module Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = {
      photo: Photo
    }
    export const Schema: RequestSchema = {
      Params: {},
      Body: {
        photo: 'Photo',
      },
    }
  }
  export module Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Photo updated successfully' as const
    }
    export type Type = Success
  }
  export module Errors {
    export class InvalidPhoto extends Response {
      statusCode = 400
      message = 'Invalid photo' as const
    }
    export type Type = InvalidPhoto
  }
  export type Response = Responses.Type | Errors.Type
}

/**
 * Update description endpoint
 */
export module UpdateDescriptionApi {
  export module Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = {
      description: string
    }
    export const Schema: RequestSchema = {
      Params: {},
      Body: {
        description: 'string',
      },
    }
  }
  export module Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Description updated successfully' as const
    }
    export type Type = Success
  }
  export module Errors {
    export type Type = Empty
  }
  export type Response = Responses.Type | Errors.Type
}
