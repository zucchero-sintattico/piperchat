export class InternalServerError {
  error = 'Internal Server Error' as const
  errorMessage: unknown
  constructor(e: unknown = '') {
    this.errorMessage = e
  }
}
