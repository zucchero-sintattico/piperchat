import { Response } from '../response'
import { RequestSchema } from '../schema'

export module GetChannelSessionIdApi {
  export module Request {
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
  export module Responses {
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
  export module Errors {
    export class ChannelNotFound extends Response {
      statusCode = 404
      message = 'Channel not found' as const
    }
    export class UserNotAuthorized extends Response {
      statusCode = 403
      message = 'User not authorized' as const
    }
    export type Type = ChannelNotFound | UserNotAuthorized
  }
  export type Response = Responses.Type | Errors.Type
}

export module GetDirectSessionIdApi {
  export module Request {
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

  export module Responses {
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

  export module Errors {
    export class FriendshipNotFound extends Response {
      statusCode = 404
      message = 'Friendship not found' as const
    }
    export type Type = FriendshipNotFound
  }

  export type Response = Responses.Type | Errors.Type
}

export module GetUsersInSession {
  export module Request {
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

  export module Responses {
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

  export module Errors {
    export class SessionNotFound extends Response {
      statusCode = 404
      message = 'Session not found' as const
    }
    export type Type = SessionNotFound
  }

  export type Response = Responses.Type | Errors.Type
}
