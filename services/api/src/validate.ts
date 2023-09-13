import { BadRequest } from './errors'
import { ResponseFacade } from './response'

interface RequestFacade<Params, Body, Query> {
  params: Params
  body: Body
  query: Query
}

interface BadRequestError {
  field: string
  expected: string
  received: string
}

function checkFields<T extends Record<string, unknown>>(
  object: T,
  schema: Record<string, string>
): BadRequestError[] {
  const errors = []
  for (const [key, value] of Object.entries(schema.Params)) {
    const param = object[key]
    if (value.endsWith('?')) {
      if (param === undefined) {
        continue
      } else {
        if (typeof param !== value.replace('?', '')) {
          errors.push({
            field: key,
            expected: value,
            received: typeof param,
          })
        }
      }
    } else {
      if (param === undefined) {
        errors.push({
          field: key,
          expected: value,
          received: 'undefined',
        })
      } else {
        if (typeof param !== value) {
          errors.push({
            field: key,
            expected: value,
            received: typeof param,
          })
        }
      }
    }
  }
  return errors
}
export function Validate<
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
    const paramsError = checkFields(params, schema.Params)
    const bodyError = checkFields(body, schema.Body)
    const queryError = checkFields(req.query, schema.Query ?? {})

    if (paramsError.length > 0 || bodyError.length > 0 || queryError.length > 0) {
      const response = new BadRequest(paramsError, bodyError, queryError)
      response.send(res)
    } else {
      next()
    }
  }
}
