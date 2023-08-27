import { Api } from '..'
import { ResponseFacade } from './response'

interface RequestFacade<Params, Body> {
  params: Params
  body: Body
}

export default function validateRequestMiddleware<
  P extends Record<string, unknown>,
  B extends Record<string, unknown>,
>(schema: {
  Params: Record<string, string>
  Body: Record<string, string>
}): (req: RequestFacade<P, B>, res: ResponseFacade, next: () => void) => void {
  return (req: RequestFacade<P, B>, res: ResponseFacade, next: () => void) => {
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

    if (paramsError.length > 0 || bodyError.length > 0) {
      const response = new Api.Errors.BadRequest(paramsError, bodyError)
      response.send(res)
    } else {
      next()
    }
  }
}
