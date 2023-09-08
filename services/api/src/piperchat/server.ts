import { Empty, ErrorResponse, Response } from '../response'
import { RequestSchema } from '../schema'

/* eslint-disable @typescript-eslint/no-namespace */
export namespace KickUserFromServerApi {
  export namespace Request {
    export type Params = {
      serverId: string
      username: string
    }
    export type Body = Empty
    export const Schema: RequestSchema = {
      Params: {
        serverId: 'string',
        username: 'string',
      },
      Body: {},
    }
  }
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'User kicked successfully'
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
    export class OwnerCannotLeave extends ErrorResponse {
      statusCode = 422
      error = 'Owner cannot leave the server' as const
    }
    export type Type = ServerNotFound | UserNotAuthorized | OwnerCannotLeave
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace GetServerParticipantsApi {
  export namespace Request {
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
    export class Success extends Response {
      statusCode = 200
      constructor(public participants: string[]) {
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

export namespace JoinServerApi {
  export namespace Request {
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
    export class Success extends Response {
      statusCode = 200
      message = 'Server joined successfully'
    }
    export type Type = Success
  }
  export namespace Errors {
    export class ServerNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Server not found' as const
    }
    export type Type = ServerNotFound
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace LeftServerApi {
  export namespace Request {
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
    export class Success extends Response {
      statusCode = 200
      message = 'Server left successfully'
    }
    export type Type = Success
  }
  export namespace Errors {
    export class ServerNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Server not found' as const
    }
    export class UserNotInServer extends ErrorResponse {
      statusCode = 422
      error = 'User not in server' as const
    }
    export class OwnerCannotLeave extends ErrorResponse {
      statusCode = 422
      error = 'Owner cannot leave the server' as const
    }
    export type Type = ServerNotFound | UserNotInServer | OwnerCannotLeave
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace GetServerApi {
  export namespace Request {
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
      _id: string
      name: string
      createdAt: Date
      channelType: string
      description?: string
    }
    interface Server {
      _id: string
      name: string
      description: string
      owner: string
      participants: string[]
      createdAt: Date
      channels: Channel[]
    }
    export class Success extends Response {
      statusCode = 200
      constructor(public server: Server) {
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
    export type Type = ServerNotFound
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace UpdateServerApi {
  export namespace Request {
    export type Params = {
      serverId: string
    }
    export type Body = {
      name?: string
      description?: string
    }
    export const Schema: RequestSchema = {
      Params: {
        serverId: 'string',
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
      message = 'Server updated successfully'
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
    export class NameOrDescriptionRequired extends ErrorResponse {
      statusCode = 422
      error = 'Name or description required' as const
    }
    export type Type = ServerNotFound | UserNotAuthorized
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace DeleteServerApi {
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
    export class Success extends Response {
      statusCode = 200
      message = 'Server deleted successfully'
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

export namespace GetServersApi {
  export namespace Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = Empty
    export const Schema: RequestSchema = {
      Params: {},
      Body: {},
    }
  }
  export namespace Responses {
    interface Channel {
      _id: string
      name: string
      createdAt: Date
      channelType: string
      description?: string
    }
    interface Server {
      _id: string
      name: string
      description: string
      owner: string
      participants: string[]
      createdAt: Date
      channels: Channel[]
    }
    export class Success extends Response {
      statusCode = 200
      constructor(public servers: Server[]) {
        super()
      }
    }
    export type Type = Success
  }
  export namespace Errors {
    export class UserNotFound extends ErrorResponse {
      statusCode = 404
      error = 'User not found' as const
    }
    export type Type = UserNotFound
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace CreateServerApi {
  export namespace Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = {
      name: string
      description: string
    }
    export const Schema: RequestSchema = {
      Params: {},
      Body: {
        name: 'string',
        description: 'string',
      },
    }
  }
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Server created successfully'
    }
    export type Type = Success
  }
  export namespace Errors {
    export class NameOrDescriptionRequired extends ErrorResponse {
      statusCode = 422
      error = 'Name or description required' as const
    }
    export type Type = NameOrDescriptionRequired
  }
  export type Response = Responses.Type | Errors.Type
}
