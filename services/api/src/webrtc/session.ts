import { Empty, Response } from '@/response'
import { RequestSchema } from '@/schema'

/* eslint-disable @typescript-eslint/no-namespace */
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
