import { Empty, Response } from '@/response'
import { RequestSchema } from '@/schema'

/* eslint-disable @typescript-eslint/no-namespace */
export namespace GetServicesStatusApi {
  export namespace Request {
    export type Type = Body & Params
    export type Params = Empty
    export type Body = Empty
    export const Schema: RequestSchema = {
      Params: {},
      Body: {},
    }
  }

  export namespace Responses {
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
  export namespace Errors {
    export type Type = Empty
  }
  export type Response = Responses.Type | Errors.Type
}
