import { BadRequest } from './errors'
import { ResponseFacade } from './response'

interface RequestFacade<Params, Body, Query> {
  params: Params
  body: Body
  query: Query
}

export function validateRequestMiddleware<
  P extends Record<string, unknown>,
  B extends Record<string, unknown>,
  Q extends Record<string, unknown>,
>(schema: {
  Params: Record<string, string>
  Body: Record<string, string>
  Query?: Record<string, string>
}): (req: RequestFacade<P, B, Q>, res: ResponseFacade, next: () => void) => void {
  return (req: RequestFacade<P, B, Q>, res: ResponseFacade, next: () => void) => {
    const params = req.params
    const body = req.body

    // Build a response with all the errors
    const paramsError = []
    for (const [key, value] of Object.entries(schema.Params)) {
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
    for (const [key, value] of Object.entries(schema.Body)) {
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

    const queryError = []
    for (const [key, value] of Object.entries(schema.Query ?? {})) {
      if (req.query[key] === undefined) {
        if (value.endsWith('?')) {
          continue
        }
        queryError.push({
          field: key,
          expected: value,
          received: 'undefined',
        })
      } else if (typeof req.query[key] !== value) {
        queryError.push({
          field: key,
          expected: value,
          received: typeof req.query[key],
        })
      }
    }

    if (paramsError.length > 0 || bodyError.length > 0 || queryError.length > 0) {
      const response = new BadRequest(paramsError, bodyError, queryError)
      response.send(res)
    } else {
      next()
    }
  }
}
