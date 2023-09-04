/* eslint-disable @typescript-eslint/no-namespace */

import { Empty, ErrorResponse } from './response'
import { RequestSchema } from './schema'

/**
 * Short template per endpoint
 */
export namespace ShortTemplate {
  export namespace Request {
    export type Params = Empty
    export type Body = Empty
    export const Schema: RequestSchema = {
      Params: {},
      Body: {},
    }
  }
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
    }
    export type Type = Success
  }
  export namespace Errors {
    export type Type = Empty
  }
  export type Response = Responses.Type | Errors.Type
}

/**
 * Template per endpoint
 */
export namespace Template {
  export namespace Request {
    export type Params = Empty
    export type Query = Empty
    export type Body = Empty
  }
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      data: unknown
      constructor(data: unknown) {
        super()
        this.data = data
      }
    }
    // ... add other response types here
    export type Type = Success // | OtherResponseType | ...
  }
  export namespace Errors {
    export class Error extends ErrorResponse {
      statusCode = 404
      error = 'Error' as const
    }
    // ... add other error types here
    export type Type = Error // | OtherErrorType | ...
  }
  export type Response = Responses.Type | Errors.Type
}
