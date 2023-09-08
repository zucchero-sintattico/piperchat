import { Empty, Response } from '@/response'
import { RequestSchema } from '@/schema'

/* eslint-disable @typescript-eslint/no-namespace */
export namespace JoinMultimediaChannelApi {
  export namespace Request {
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
      sessionId: string
      constructor(sessionId: string) {
        super()
        this.sessionId = sessionId
      }
    }
    export type Type = Success
  }
  export namespace Errors {
    export class SessionNotFound extends Response {
      statusCode = 404
      constructor() {
        super()
      }
    }
    export class UserNotAllowed extends Response {
      statusCode = 403
      constructor() {
        super()
      }
    }
    export type Type = SessionNotFound | UserNotAllowed
  }
  export type Response = Responses.Type | Errors.Type
}
