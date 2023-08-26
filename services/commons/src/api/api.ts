/* eslint-disable @typescript-eslint/no-namespace */
import { ErrorResponse } from './commons'

export namespace ErrorsResponses {
  export class InternalServerError implements ErrorResponse {
    error = 'Internal Server Error' as const
    errorMessage: unknown
    constructor(e: unknown = '') {
      this.errorMessage = e
    }
  }
}

export * as Users from './users'
