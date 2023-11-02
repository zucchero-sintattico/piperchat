import { Router } from 'express'
import {
  DirectController,
  DirectControllerExceptions,
} from '@controllers/direct/direct-controller'
import { DirectControllerImpl } from '@controllers/direct/direct-controller-impl'
import { GetDirectMessagesApi, SendDirectMessageApi } from '@api/messages/direct'
import { Route } from '@commons/route'

const directController: DirectController = new DirectControllerImpl()

const GetDirectMessagesApiRoute = new Route<
  GetDirectMessagesApi.Response,
  GetDirectMessagesApi.Request.Params,
  GetDirectMessagesApi.Request.Body,
  GetDirectMessagesApi.Request.Query
>({
  method: 'get',
  path: '/:username/messages',
  schema: GetDirectMessagesApi.Request.Schema,
  handler: async (req, res) => {
    const messages = await directController.getDirectMessagesPaginated(
      req.user.username,
      req.params.username,
      req.query.from,
      req.query.limit
    )
    const response = new GetDirectMessagesApi.Responses.Success(messages)
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: DirectControllerExceptions.DirectNotFound,
      onException(e, req, res) {
        res.sendResponse(new GetDirectMessagesApi.Errors.DirectNotFound())
      },
    },
  ],
})

const SendDirectMessageApiRoute = new Route<
  SendDirectMessageApi.Response,
  SendDirectMessageApi.Request.Params,
  SendDirectMessageApi.Request.Body
>({
  method: 'post',
  path: '/:username/messages',
  schema: SendDirectMessageApi.Request.Schema,
  handler: async (req, res) => {
    await directController.sendDirectMessage(
      req.user.username,
      req.params.username,
      req.body.message
    )
    const response = new SendDirectMessageApi.Responses.Success()
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: DirectControllerExceptions.DirectNotFound,
      onException(e, req, res) {
        res.sendResponse(new SendDirectMessageApi.Errors.DirectNotFound())
      },
    },
    {
      exception: DirectControllerExceptions.CannotSendDirectMessageToYourself,
      onException(e, req, res) {
        res.sendResponse(
          new SendDirectMessageApi.Errors.CannotSendDirectMessageToYourself()
        )
      },
    },
  ],
})

export const directRouter = Router({
  strict: true,
  mergeParams: true,
})

GetDirectMessagesApiRoute.attachToRouter(directRouter)
SendDirectMessageApiRoute.attachToRouter(directRouter)
