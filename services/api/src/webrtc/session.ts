import { Response } from '../response'
import { RequestSchema } from '../schema'

/* eslint-disable @typescript-eslint/no-namespace */
export namespace GetChannelSessionIdApi {
  export namespace Request {
    export type Type = Params
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
  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Session id retrieved successfully' as const
      sessionId: string
      constructor(data: { sessionId: string }) {
        super()
        this.sessionId = data.sessionId
      }
    }
    export type Type = Success
  }
  export namespace Errors {
    export class ChannelNotFound extends Response {
      statusCode = 404
      message = 'Channel not found' as const
    }
    export type Type = ChannelNotFound
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace GetDirectSessionIdApi {
  export namespace Request {
    export type Type = Params
    export type Params = {
      username: string
    }
    export const Schema: RequestSchema = {
      Params: {
        username: 'string',
      },
      Body: {},
    }
  }

  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Session id retrieved successfully' as const
      sessionId: string
      constructor(data: { sessionId: string }) {
        super()
        this.sessionId = data.sessionId
      }
    }
    export type Type = Success
  }

  export namespace Errors {
    export class FriendshipNotFound extends Response {
      statusCode = 404
      message = 'Friendship not found' as const
    }
    export type Type = FriendshipNotFound
  }

  export type Response = Responses.Type | Errors.Type
}

export namespace GetUsersInSession {
  export namespace Request {
    export type Type = Params
    export type Params = {
      sessionId: string
    }
    export const Schema: RequestSchema = {
      Params: {
        sessionId: 'string',
      },
      Body: {},
    }
  }

  export namespace Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Users retrieved successfully' as const
      users: string[]
      constructor(data: { users: string[] }) {
        super()
        this.users = data.users
      }
    }
    export type Type = Success
  }

  export namespace Errors {
    export class SessionNotFound extends Response {
      statusCode = 404
      message = 'Session not found' as const
    }
    export type Type = SessionNotFound
  }

  export type Response = Responses.Type | Errors.Type
}
