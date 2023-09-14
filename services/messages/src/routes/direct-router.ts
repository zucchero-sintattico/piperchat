import { Request, Response, Router } from 'express'
import { DirectController } from '@controllers/direct/direct-controller'
import { DirectControllerImpl } from '@controllers/direct/direct-controller-impl'

import { Validate } from '@api/validate'
import { InternalServerError } from '@api/errors'
import { GetDirectMessagesApi, SendDirectMessageApi } from '@api/messages/direct'

const directController: DirectController = new DirectControllerImpl()
const directRouter = Router({
  strict: true,
  mergeParams: true,
})

directRouter.get(
  '/:username/messages',
  //Validate(GetDirectMessagesApi.Request.Schema),
  async (
    req: Request<
      GetDirectMessagesApi.Request.Params,
      GetDirectMessagesApi.Response,
      GetDirectMessagesApi.Request.Body,
      GetDirectMessagesApi.Request.Query
    >,
    res: Response<GetDirectMessagesApi.Response | InternalServerError>
  ) => {
    try {
      const messages = await directController.getDirectMessagesPaginated(
        req.user.username,
        req.params.username,
        req.query.from,
        req.query.limit
      )
      const response = new GetDirectMessagesApi.Responses.Success(messages)
      response.send(res)
    } catch (e) {
      const response = new InternalServerError(e)
      response.send(res)
    }
  }
)

directRouter.post(
  '/:username/messages',
  Validate(SendDirectMessageApi.Request.Schema),
  async (
    req: Request<
      SendDirectMessageApi.Request.Params,
      SendDirectMessageApi.Response,
      SendDirectMessageApi.Request.Body
    >,
    res: Response<SendDirectMessageApi.Response | InternalServerError>
  ) => {
    try {
      await directController.sendDirectMessage(
        req.user.username,
        req.params.username,
        req.body.message
      )
      const response = new SendDirectMessageApi.Responses.Success()
      response.send(res)
    } catch (e) {
      const response = new InternalServerError(e)
      response.send(res)
    }
  }
)

export { directRouter }
