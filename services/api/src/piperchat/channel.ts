import { Empty, ErrorResponse, Response } from '../response'
import { RequestSchema } from '../schema'

export module GetChannelsApi {
  export module Request {
    export type Type = Body & Params
    export type Params = {
      serverId: string
    }
    export type Body = Empty
    export const Schema: RequestSchema = {
      Params: {
        serverId: 'string',
      },
      Body: {},
    }
  }
  export module Responses {
    interface Channel {
      id: string
      name: string
      createdAt: Date
      channelType: string
      description?: string
    }
    export class Success extends Response {
      statusCode = 200
      message = 'Channels retrieved successfully'
      constructor(public channels: Channel[]) {
        super()
      }
    }
    export type Type = Success
  }
  export module Errors {
    export class ServerNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Server not found' as const
    }
    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 403
      error = 'User not authorized' as const
    }
    export type Type = ServerNotFound | UserNotAuthorized
  }
  export type Response = Responses.Type | Errors.Type
}

export module GetChannelByIdApi {
  export module Request {
    export type Type = Body & Params
    export type Params = {
      serverId: string
      channelId: string
    }
    export const Schema: RequestSchema = {
      Params: {
        serverId: 'string',
        channelId: 'string',
      },
      Body: {},
    }
  }
  export module Responses {
    export interface Channel {
      id: string
      name: string
      createdAt: Date
      channelType: string
      description?: string
    }
    export class Success extends Response {
      statusCode = 200
      message = 'Channels retrieved successfully'
      constructor(public channel: Channel) {
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
    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 403
      error = 'User not authorized' as const
    }

    export class ServerNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Server not found' as const
    }

    export type Type = ChannelNotFound | UserNotAuthorized | ServerNotFound
  }
  export type Response = Responses.Type | Errors.Type
}

export module CreateChannelApi {
  export enum ChannelType {
    Messages = 'messages',
    Multimedia = 'multimedia',
  }
  export module Request {
    export type Type = Body & Params
    export type Params = {
      serverId: string
    }
    export type Body = {
      name: string
      channelType: ChannelType
      description?: string
    }
    export const Schema: RequestSchema = {
      Params: {
        serverId: 'string',
      },
      Body: {
        name: 'string',
        channelType: 'string',
        description: 'string?',
      },
    }
  }
  export module Responses {
    interface Channel {
      id: string
      name: string
      createdAt: Date
      channelType: string
      description?: string
    }
    export class Success extends Response {
      statusCode = 200
      message = 'Channel created successfully'
      channel: Channel
      constructor(channel: Channel) {
        super()
        this.channel = channel
      }
    }
    export type Type = Success
  }
  export module Errors {
    export class ServerNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Server not found' as const
    }
    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 403
      error = 'User not authorized' as const
    }

    export class ChannelAlreadyExists extends ErrorResponse {
      statusCode = 409
      error = 'Channel already exists' as const
    }

    export class InvalidChannelType extends ErrorResponse {
      statusCode = 400
      error = 'Invalid channel type' as const
    }

    export type Type =
      | ServerNotFound
      | UserNotAuthorized
      | ChannelAlreadyExists
      | InvalidChannelType
  }
  export type Response = Responses.Type | Errors.Type
}

export module UpdateChannelApi {
  export module Request {
    export type Type = Body & Params
    export type Params = {
      serverId: string
      channelId: string
    }
    export type Body = {
      name?: string
      description?: string
    }
    export const Schema: RequestSchema = {
      Params: {
        serverId: 'string',
        channelId: 'string',
      },
      Body: {
        name: 'string?',
        description: 'string?',
      },
    }
  }
  export module Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Channel updated successfully'
    }
    export type Type = Success
  }
  export module Errors {
    export class ServerNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Server not found' as const
    }
    export class ChannelNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Channel not found' as const
    }
    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 403
      error = 'User not authorized' as const
    }

    export class ChannelAlreadyExists extends ErrorResponse {
      statusCode = 409
      error = 'Channel already exists' as const
    }
    export type Type =
      | ServerNotFound
      | ChannelNotFound
      | UserNotAuthorized
      | ChannelAlreadyExists
  }
  export type Response = Responses.Type | Errors.Type
}

export module DeleteChannelApi {
  export module Request {
    export type Type = Body & Params
    export type Params = {
      serverId: string
      channelId: string
    }
    export type Body = Empty
    export const Schema: RequestSchema = {
      Params: {
        serverId: 'string',
        channelId: 'string',
      },
      Body: {},
    }
  }
  export module Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Channel deleted successfully'
    }
    export type Type = Success
  }
  export module Errors {
    export class ServerNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Server not found' as const
    }
    export class ChannelNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Channel not found' as const
    }
    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 403
      error = 'User not authorized' as const
    }
    export type Type = ServerNotFound | ChannelNotFound | UserNotAuthorized
  }
  export type Response = Responses.Type | Errors.Type
}
