import { ErrorResponse } from './response'

export class InternalServerError extends ErrorResponse {
  status = 500
  error = 'Internal Server Error' as const
  errorMessage: unknown
  constructor(e: unknown = '') {
    super()
    this.errorMessage = e
  }
}
