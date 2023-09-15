/* eslint-disable @typescript-eslint/no-namespace */
import { Empty, ErrorResponse, Response } from '../response'
import { RequestSchema } from '../schema'

export namespace GetChannelsApi {
  export namespace Request {
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
  export namespace Responses {
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
  export namespace Errors {
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

export namespace GetChannelByIdApi {
  export namespace Request {
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
  export namespace Responses {
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
      constructor(public channel: Channel) {
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
    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 403
      error = 'User not authorized' as const
    }
    export type Type = ChannelNotFound | UserNotAuthorized
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace CreateChannelApi {
  export enum ChannelType {
    Messages = 'messages',
    Multimedia = 'multimedia',
  }
  export namespace Request {
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
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Channel created successfully'
    }
    export type Type = Success
  }
  export namespace Errors {
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

export namespace UpdateChannelApi {
  export namespace Request {
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
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Channel updated successfully'
    }
    export type Type = Success
  }
  export namespace Errors {
    export class ChannelNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Channel not found' as const
    }
    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 403
      error = 'User not authorized' as const
    }
    export type Type = ChannelNotFound | UserNotAuthorized
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace DeleteChannelApi {
  export namespace Request {
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
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Channel deleted successfully'
    }
    export type Type = Success
  }
  export namespace Errors {
    export class ChannelNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Channel not found' as const
    }
    export class UserNotAuthorized extends ErrorResponse {
      statusCode = 403
      error = 'User not authorized' as const
    }
    export type Type = ChannelNotFound | UserNotAuthorized
  }
  export type Response = Responses.Type | Errors.Type
}
