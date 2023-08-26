/* eslint-disable @typescript-eslint/no-namespace */

export namespace Login {
  export interface Request {
    username: string
    password: string
  }

  export namespace Responses {
    export class Success {
      message = 'Logged in' as const
    }
    export class UsernameOrPasswordIncorrect {
      error = 'Username or password incorrect' as const
    }
  }

  export type Response = Responses.Success | Responses.UsernameOrPasswordIncorrect
}

export namespace Register {
  export interface Request {
    username: string
    password: string
    email: string
    description?: string
    photo?: Buffer
  }

  export namespace Responses {
    export class Success {
      createdUser: unknown
      constructor(user: unknown) {
        this.createdUser = user
      }
    }
    export class UserAlreadyExists {
      error = 'User already exists' as const
    }
  }

  export type Response = Responses.Success | Responses.UserAlreadyExists
}
