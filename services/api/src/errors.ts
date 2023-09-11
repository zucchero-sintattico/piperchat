import { ErrorResponse } from './response'

export class InternalServerError extends ErrorResponse {
  statusCode = 500
  error = 'Internal Server Error' as const
  errorMessage: string
  constructor(e: string = '') {
    super()
    this.errorMessage = e
  }
}

interface BadFieldError {
  field: string
  expected: string
  received: string
}

export class BadRequest extends ErrorResponse {
  statusCode = 400
  error = 'Bad Request' as const
  params: BadFieldError[]
  body: BadFieldError[]
  query?: BadFieldError[]
  constructor(params: BadFieldError[], body: BadFieldError[], query?: BadFieldError[]) {
    super()
    this.params = params
    this.body = body
    this.query = query
  }
}
