/* eslint-disable @typescript-eslint/no-namespace */

export namespace ErrorsResponses {
  export class InternalServerError {
    error = 'Internal Server Error' as const
    errorMessage: unknown
    constructor(e: unknown = '') {
      this.errorMessage = e
    }
  }
}

export * as Users from './users'
