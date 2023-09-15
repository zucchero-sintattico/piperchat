/* eslint-disable @typescript-eslint/no-namespace */
import { Empty, ErrorResponse, Response } from '../response'
import { RequestSchema } from '../schema'

export namespace GetDirectMessagesApi {
  export namespace Request {
    export type Type = Body & Params & Query
    export type Params = {
      username: string
    }
    export type Body = Empty
    export type Query = {
      from: number
      limit: number
    }
    export const Schema: RequestSchema = {
      Params: {
        username: 'string',
      },
      Body: {},
      Query: {
        from: 'number',
        limit: 'number',
      },
    }
  }
  export namespace Responses {
    export interface Message {
      _id: string
      sender: string
      content: string
      timestamp: Date
    }
    export class Success extends Response {
      statusCode = 200
      message = 'Messages retrieved successfully'
      constructor(public messages: Message[]) {
        super()
      }
    }
    export type Type = Success
  }
  export namespace Errors {
    export class DirectNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Direct not found' as const
    }
    export type Type = DirectNotFound
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace SendDirectMessageApi {
  export namespace Request {
    export type Type = Body & Params
    export type Params = {
      username: string
    }
    export type Body = {
      message: string
    }
    export type Query = Empty
    export const Schema: RequestSchema = {
      Params: {
        username: 'string',
      },
      Body: {
        message: 'string',
      },
    }
  }
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Message sent successfully'
    }
    export type Type = Success
  }
  export namespace Errors {
    export class DirectNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Direct not found' as const
    }
    export class CannotSendDirectMessageToYourself extends ErrorResponse {
      statusCode = 400
      error = 'Cannot send direct message to yourself' as const
    }
    export type Type = DirectNotFound | CannotSendDirectMessageToYourself
  }
  export type Response = Responses.Type | Errors.Type
}
