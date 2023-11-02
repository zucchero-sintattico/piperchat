import { BadRequest } from './errors'
import { ResponseFacade } from './response'

interface RequestFacade<Params, Body, Query> {
  params: Params
  body: Body
  query: Query
}

function checkFields<T extends Record<string, unknown>>(
  object: T,
  schema: Record<string, string>
): string[] {
  const missing = []
  for (const [key, value] of Object.entries(schema)) {
    if (!(key in object) && !value.endsWith('?')) {
      missing.push(key)
    }
  }
  return missing
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
