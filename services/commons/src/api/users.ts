/* eslint-disable @typescript-eslint/no-namespace */

export namespace Register {
  export interface Request {
    username: string
    password: string
    email: string
    description?: string
    photo?: Buffer
  }

  export namespace Responses {
    interface UserLoginResponse {
      username: string
      email: string
      description?: string
      photo?: Buffer
    }

    export class Success {
      createdUser: unknown
      constructor(user: UserLoginResponse) {
        this.createdUser = user
      }
    }

    export type Type = Success
  }

  export namespace Errors {
    export class UserAlreadyExists {
      error = 'User already exists' as const
    }

    export type Type = UserAlreadyExists
  }

  export type Response = Responses.Type | Errors.Type
}

export namespace Login {
  export interface Request {
    username: string
    password: string
  }

  export namespace Responses {
    export class Success {
      message = 'Logged in' as const
    }

    export type Type = Success
  }

  export namespace Errors {
    export class UsernameOrPasswordIncorrect {
      error = 'Username or password incorrect' as const
    }
    export type Type = UsernameOrPasswordIncorrect
  }

  export type Response = Responses.Type | Errors.Type
}

export namespace Logout {
  export interface Request {}
  export namespace Responses {
    export class Success {
      message = 'Logged out' as const
    }

    export type Type = Success
  }
  export namespace Errors {
    export class UserNotFound {
      error = 'User not found' as const
    }
    export class NotLoggedIn {
      error = 'Unauthorized' as const
    }
    export type Type = UserNotFound | NotLoggedIn
  }
  export type Response = Responses.Type | Errors.Type
}

export namespace RefreshToken {
  export interface Request {}
  export namespace Responses {
    export class Success {
      message = 'Refreshed token' as const
    }
    export type Type = Success
  }
  export namespace Errors {
    export class UserNotFound {
      error = 'User not found' as const
    }
    export class InvalidRefreshToken {
      error = 'Invalid refresh token' as const
    }
    export class RefreshTokenNotPresent {
      error = 'Refresh token not present' as const
    }
    export type Type = UserNotFound | InvalidRefreshToken | RefreshTokenNotPresent
  }
  export type Response = Responses.Type | Errors.Type
}
