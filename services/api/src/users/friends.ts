import { Empty, ErrorResponse, Response } from '../response'
import { EmptySchema, RequestSchema } from '../schema'

export module GetFriendsApi {
  export module Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = Empty
    export const Schema: RequestSchema = EmptySchema
  }
  export module Responses {
    export class Success extends Response {
      statusCode = 200
      friends: string[]
      constructor(friends: string[]) {
        super()
        this.friends = friends
      }
    }
    export type Type = Success
  }
  export module Errors {
    export class UserNotFound extends ErrorResponse {
      statusCode = 404
      error = 'User not found' as const
    }
    export type Type = UserNotFound
  }
  export type Response = Responses.Type | Errors.Type
}

export module GetFriendsRequestsApi {
  export module Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = Empty
    export const Schema: RequestSchema = EmptySchema
  }
  export module Responses {
    export class Success extends Response {
      statusCode = 200
      requests: string[]
      constructor(requests: string[]) {
        super()
        this.requests = requests
      }
    }
    export type Type = Success
  }
  export module Errors {
    export class UserNotFound extends ErrorResponse {
      statusCode = 404
      error = 'User not found' as const
    }
    export type Type = UserNotFound
  }
  export type Response = Responses.Type | Errors.Type
}

export module SendFriendRequestApi {
  export module Request {
    export type Type = Body & Params
    export enum FriendRequestAction {
      send = 'send',
      accept = 'accept',
      deny = 'deny',
    }
    export type Params = Empty
    export type Body = {
      to: string
      action: FriendRequestAction
    }
    export const Schema: RequestSchema = {
      Params: {},
      Body: {
        to: 'string',
        action: 'string',
      },
    }
  }
  export module Responses {
    export class Success extends Response {
      statusCode = 200
      message = 'Friend request sent' as const
    }
    export class FriendRequestAccepted extends Response {
      statusCode = 200
      message = 'Friend request accepted' as const
    }
    export class FriendRequestDenied extends Response {
      statusCode = 200
      message = 'Friend request denied' as const
    }

    export type Type = Success | FriendRequestAccepted | FriendRequestDenied
  }
  export module Errors {
    export class UserNotFound extends ErrorResponse {
      statusCode = 404
      error = 'User not found' as const
    }
    export class InvalidAction extends ErrorResponse {
      statusCode = 400
      error: string
      constructor(action: string) {
        super()
        this.error = `Invalid 'action' parameter in body: '${action}'`
      }
    }
    export class FriendRequestAlreadySent extends ErrorResponse {
      statusCode = 409
      error = 'Friend request already sent' as const
    }
    export class FriendRequestNotFound extends ErrorResponse {
      statusCode = 404
      error = 'Friend request not found' as const
    }
    export class CannotSendFriendRequestToYourself extends ErrorResponse {
      statusCode = 400
      error = 'Cannot send a friend request to yourself' as const
    }

    export type Type =
      | UserNotFound
      | InvalidAction
      | FriendRequestAlreadySent
      | FriendRequestNotFound
      | CannotSendFriendRequestToYourself
  }
  export type Response = Responses.Type | Errors.Type
}
