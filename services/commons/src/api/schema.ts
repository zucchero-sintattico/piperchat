import {
  Request as ExRequest,
  Router,
  Response as ExResponse,
  NextFunction,
  IRouterMatcher,
  IRouter,
} from 'express'
import { Api } from '..'

export interface RequestSchema {
  Params: Record<string, string>
  Body: Record<string, string>
}

export const EmptySchema: RequestSchema = {
  Params: {},
  Body: {},
}

class Response {
  Status: number
  Body: Record<string, string>
  constructor({ status, body }: { status: number; body: Record<string, string> }) {
    this.Status = status
    this.Body = body
  }

  send(res: ExResponse) {
    res.status(this.Status).send(this.Body)
  }
}
class ErrorResponse extends Response {
  constructor({ status, error }: { status: number; error: string }) {
    super({
      status: status,
      body: {
        error: error,
      },
    })
  }
}

enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const EmptyRequest: RequestSchema = {
  Params: {},
  Body: {},
}

abstract class Endpoint {
  private router: IRouter
  abstract Path: string
  abstract Method: Method
  Request: RequestSchema = EmptyRequest
  Responses: Record<string, Response> = {}
  Errors?: Record<string, unknown> = {}
  constructor(router: IRouter) {
    this.router = router
  }
  unpack<P, B>(req: ExRequest): { params: P; body: B } {
    const params = req.params as P
    const body = req.body as B
    return {
      params,
      body,
    }
  }
  validate(req: ExRequest, res: ExResponse, next: NextFunction) {
    const params = req.params
    const body = req.body

    // Build a response with all the errors
    const paramsError = []
    for (const [key, value] of Object.entries(this.Request.Params)) {
      if (params[key] === undefined) {
        if (value.endsWith('?')) {
          continue
        }
        paramsError.push({
          field: key,
          expected: value,
          received: 'undefined',
        })
      } else if (typeof params[key] !== value) {
        paramsError.push({
          field: key,
          expected: value,
          received: typeof params[key],
        })
      }
    }

    const bodyError = []
    for (const [key, value] of Object.entries(this.Request.Body)) {
      if (body[key] === undefined) {
        if (value.endsWith('?')) {
          continue
        }
        bodyError.push({
          field: key,
          expected: value,
          received: 'undefined',
        })
      } else if (typeof body[key] !== value) {
        bodyError.push({
          field: key,
          expected: value,
          received: typeof body[key],
        })
      }
    }

    if (paramsError.length > 0 || bodyError.length > 0) {
      const response = new Api.Errors.BadRequest(paramsError, bodyError)
      response.send(res)
    } else {
      next()
    }
  }

  use(...handlers: ((req: ExRequest, res: ExResponse, next: NextFunction) => void)[]) {
    let method: IRouterMatcher<Router>
    switch (this.Method) {
      case Method.GET:
        method = this.router.get
        break
      case Method.POST:
        method = this.router.post
        break
      case Method.PUT:
        method = this.router.put
        break
      case Method.DELETE:
        method = this.router.delete
        break
    }
    if (method === undefined) {
      throw new Error('Invalid method')
    }
    method.bind(this.router)(this.Path, ...handlers)
  }
}

export class RegisterEndpoint extends Endpoint {
  Path = '/register'
  Method = Method.GET
  Request = {
    Params: {},
    Body: class {
      username: string
      email: string
      password: string
      description?: string
      photo?: Buffer
    },
  }
  Responses = {
    Success: new Response({
      status: 200,
      body: {
        message: 'Success',
      },
    }),
  }
  Errors = {
    UserAlreadyExist: () =>
      new ErrorResponse({
        status: 400,
        error: 'User Already Exist',
      }),
    UserNotFound: (username: string) =>
      new ErrorResponse({
        status: 404,
        error: `User ${username} not found`,
      }),
  }
}
