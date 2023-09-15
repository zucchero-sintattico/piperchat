/* eslint-disable @typescript-eslint/no-namespace */
import { Empty, ErrorResponse, Response } from '../response'
import { RequestSchema } from '../schema'

export namespace GetChannelMessagesApi {
  export namespace Request {
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
  export namespace Responses {
    interface Message {
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
    export class ChannelNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Channel not found' as const
    }
    export class ServerNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Server not found' as const
    }

    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 401
      error = 'User not authorized' as const
    }

    export type Type = ChannelNotFound | ServerNotFound | UserNotAuthorized
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace SendMessageInChannelApi {
  export namespace Request {
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
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Message sent successfully'
    }
    export type Type = Success
  }
  export namespace Errors {
    export class ChannelNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Channel not found' as const
    }
    export class ServerNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Server not found' as const
    }
    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 401
      error = 'User not authorized' as const
    }
    export type Type = ChannelNotFound | ServerNotFound | UserNotAuthorized
  }
  export type Response = Responses.Type | Errors.Type
}
