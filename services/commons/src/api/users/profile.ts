/* eslint-disable @typescript-eslint/no-namespace */

import { Empty, Response } from '../response'

/**
 * Update photo endpoint
 */
export namespace UpdatePhoto {
  export namespace Request {
    export type Params = Empty
    export type Query = Empty
    export type Body = {
      photo: Buffer
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
