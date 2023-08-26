export interface ResponseFacade {
  status(status: number): ResponseFacade
  json(data: unknown): ResponseFacade
  cookie(name: string, value: string, options: unknown): ResponseFacade
  clearCookie(name: string): ResponseFacade
}

export abstract class Response {
  abstract status: number
  public send(res: ResponseFacade): void {
    res.status(this.status).json(this)
  }
}

export abstract class ErrorResponse extends Response {
  abstract error: string
}
