import { ErrorResponse } from './response'

export class InternalServerError extends ErrorResponse {
  statusCode = 500
  error = 'Internal Server Error' as const
  errorMessage: unknown
  constructor(e: unknown = '') {
    super()
    this.errorMessage = e
  }
}

export class BadRequest extends ErrorResponse {
  statusCode = 400
  error = 'Bad Request' as const
  missingParams: string[]
  missingBody: string[]
  missingQuery?: string[]
  constructor(params: string[], body: string[], query?: string[]) {
    super()
    this.missingParams = params
    this.missingBody = body
    this.missingQuery = query
  }
}

export class JwtTokenMissingOrInvalid extends ErrorResponse {
  statusCode = 401
  error = 'JWT Token Missing or Invalid' as const
}
