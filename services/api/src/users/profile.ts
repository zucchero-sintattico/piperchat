/* eslint-disable @typescript-eslint/no-namespace */

import { Empty, Response } from '../response'
import { RequestSchema } from '../schema'

/**
 * Update photo endpoint
 */
export namespace UpdatePhotoApi {
  export namespace Request {
    export type Params = Empty
    export type Body = {
      photo: Buffer
    }
    export const Schema: RequestSchema = {
      Params: {},
      Body: {
        photo: 'Buffer',
      },
    }
  }
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Photo updated successfully' as const
    }
    export type Type = Success
  }
  export namespace Errors {
    export type Type = Empty
  }
  export type Response = Responses.Type | Errors.Type
}

/**
 * Update description endpoint
 */
export namespace UpdateDescriptionApi {
  export namespace Request {
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
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Description updated successfully' as const
    }
    export type Type = Success
  }
  export namespace Errors {
    export type Type = Empty
  }
  export type Response = Responses.Type | Errors.Type
}
