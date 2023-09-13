import { Request, Response, Router } from 'express'
import {
  ChannelController,
  ChannelControllerExceptions,
} from '@controllers/channel/channel-controller'
import { ChannelControllerImpl } from '@controllers/channel/channel-controller-impl'

import { Validate } from '@api/validate'
import { InternalServerError } from '@api/errors'
import { GetChannelMessagesApi, SendMessageInChannelApi } from '@api/messages/channel'

const channelController: ChannelController = new ChannelControllerImpl()
const channelRouter = Router({
  strict: true,
  mergeParams: true,
})

channelRouter.get(
  ':serverId/channels/:channelId/messages',
  Validate(GetChannelMessagesApi.Request.Schema),
  async (
    req: Request<
      GetChannelMessagesApi.Request.Params,
      GetChannelMessagesApi.Response,
      GetChannelMessagesApi.Request.Body,
      GetChannelMessagesApi.Request.Query
    >,
    res: Response<GetChannelMessagesApi.Response | InternalServerError>
  ) => {
    try {
      const messages = await channelController.getChannelMessagesPaginated(
        req.params.channelId,
        req.params.serverId,
        req.query.from,
        req.query.limit
      )
      const response = new GetChannelMessagesApi.Responses.Success(messages)
      response.send(res)
    } catch (e) {
      if (e instanceof ChannelControllerExceptions.ChannelNotFound) {
        const response = new GetChannelMessagesApi.Errors.ChannelNotFound()
        response.send(res)
      } else if (e instanceof ChannelControllerExceptions.ServerNotFound) {
        const response = new GetChannelMessagesApi.Errors.ServerNotFound()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

channelRouter.post(
  ':serverId/channels/:channelId/messages',
  Validate(SendMessageInChannelApi.Request.Schema),
  async (
    req: Request<
      SendMessageInChannelApi.Request.Params,
      SendMessageInChannelApi.Response,
      SendMessageInChannelApi.Request.Body
    >,
    res: Response<SendMessageInChannelApi.Response | InternalServerError>
  ) => {
    try {
      await channelController.sendMessage(
        req.params.channelId,
        req.params.serverId,
        req.user.username,
        req.body.content
      )
      const response = new SendMessageInChannelApi.Responses.Success()
      response.send(res)
    } catch (e) {
      if (e instanceof ChannelControllerExceptions.ChannelNotFound) {
        const response = new SendMessageInChannelApi.Errors.ChannelNotFound()
        response.send(res)
      } else if (e instanceof ChannelControllerExceptions.ServerNotFound) {
        const response = new SendMessageInChannelApi.Errors.ServerNotFound()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

export { channelRouter }
