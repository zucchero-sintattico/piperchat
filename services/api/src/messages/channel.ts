import { Empty, ErrorResponse, Response } from '../response'
import { RequestSchema } from '../schema'
/* eslint-disable @typescript-eslint/no-namespace */
export module GetChannelMessagesApi {
  export module Request {
    export type Type = Body & Params & Query
    export type Params = {
      serverId: string
      channelId: string
    }
    export type Body = Empty
    export type Query = {
      from: number
      limit: number
    }
    export const Schema: RequestSchema = {
      Params: {
        serverId: 'string',
        channelId: 'string',
      },
      Body: {},
      Query: {
        from: 'number',
        limit: 'number',
      },
    }
  }
  export module Responses {
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
  export module Errors {
    export class ChannelNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Channel not found' as const
    }
    export class ServerNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Server not found' as const
    }

    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 403
      error = 'User not authorized' as const
    }

    export type Type = ChannelNotFound | ServerNotFound | UserNotAuthorized
  }
  export type Response = Responses.Type | Errors.Type
}

export module SendMessageInChannelApi {
  export module Request {
    export type Type = Body & Params
    export type Params = {
      serverId: string
      channelId: string
    }
    export type Body = {
      content: string
    }
    export const Schema: RequestSchema = {
      Params: {
        serverId: 'string',
        channelId: 'string',
      },
      Body: {
        content: 'string',
      },
    }
  }
  export module Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Message sent successfully'
    }
    export type Type = Success
  }
  export module Errors {
    export class ChannelNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Channel not found' as const
    }
    export class ServerNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Server not found' as const
    }
    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 403
      error = 'User not authorized' as const
    }
    export type Type = ChannelNotFound | ServerNotFound | UserNotAuthorized
  }
  export type Response = Responses.Type | Errors.Type
}
