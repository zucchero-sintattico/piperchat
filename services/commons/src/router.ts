/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response as ExpressResponse } from 'express'
import { Validate } from '@api/validate'
import { InternalServerError } from '@api/errors'
import { Response as ApiResponse } from '@api/response'
import { RequestSchema } from '@api/schema'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Response<
      ResBody = any,
      Locals extends Record<string, any> = Record<string, any>,
    > {
      sendResponse(res: ApiResponse): void
    }
  }
}

type Exception<P, R, B, Q> = {
  exception: any
  onException: (e: any, req: Request<P, R, B, Q>, res: ExpressResponse<R>) => void
}

interface Route<
  R extends ApiResponse = ApiResponse,
  P extends Record<string, unknown> = Record<string, unknown>,
  B extends Record<string, unknown> = Record<string, unknown>,
  Q extends Record<string, unknown> = Record<string, unknown>,
> {
  method: 'get' | 'post' | 'put' | 'delete'
  path: string
  schema: RequestSchema
  exceptions?: [Exception<P, R, B, Q>]
  handler: (req: Request<P, R, B, Q>, res: ExpressResponse<R>) => Promise<void>
}

export class ApiRouter {
  constructor(
    private router: Router = Router({
      strict: true,
      mergeParams: true,
    })
  ) {}

  public getRouter(): Router {
    return this.router
  }

  public route<
    R extends ApiResponse = ApiResponse,
    P extends Record<string, unknown> = Record<string, unknown>,
    B extends Record<string, unknown> = Record<string, unknown>,
    Q extends Record<string, unknown> = Record<string, unknown>,
  >(data: Route<R, P, B, Q>) {
    this.router[data.method](
      data.path,
      (req: Request<P, R, B, Q>, res, next) => {
        res.sendResponse = (response: R) => {
          res.status(response.statusCode).json(response)
        }
        next()
      },
      Validate(data.schema),
      async (req: Request<P, R, B, Q>, res: ExpressResponse<R>) => {
        try {
          await data.handler(req, res)
        } catch (e) {
          if (data.exceptions) {
            for (const exception of data.exceptions) {
              if (e instanceof exception.exception) {
                exception.onException(e, req, res)
                return
              }
            }
          }
          const response = new InternalServerError(e)
          response.send(res)
        }
      }
    )
  }
}
