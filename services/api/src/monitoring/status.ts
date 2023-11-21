import { Empty, Response } from '@api/response'
import { RequestSchema } from '@api/schema'
/* eslint-disable @typescript-eslint/no-namespace */

export module GetServicesStatusApi {
  export module Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = Empty
    export const Schema: RequestSchema = {
      Params: {},
      Body: {},
    }
  }

  export module Responses {
    interface ServiceStatus {
      _id: string
      service: string
      status: string
      timestamp: Date
    }
    export class Success extends Response {
      statusCode = 200
      services: ServiceStatus[]
      constructor(services: ServiceStatus[]) {
        super()
        this.services = services
      }
    }
    export type Type = Success
  }
  export module Errors {
    export type Type = Empty
  }
  export type Response = Responses.Type | Errors.Type
}
