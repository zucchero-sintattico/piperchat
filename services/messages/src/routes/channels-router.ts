import { Router } from 'express'
import {
  ChannelController,
  ChannelControllerExceptions,
} from '@controllers/channel/channel-controller'
import { ChannelControllerImpl } from '@controllers/channel/channel-controller-impl'
import { Route } from '@commons/route'
import { GetChannelMessagesApi, SendMessageInChannelApi } from '@api/messages/channel'

const channelController: ChannelController = new ChannelControllerImpl()

const GetChannelMessagesApiRoute = new Route<
  GetChannelMessagesApi.Response,
  GetChannelMessagesApi.Request.Params,
  GetChannelMessagesApi.Request.Body,
  GetChannelMessagesApi.Request.Query
>({
  method: 'get',
  path: '/:serverId/channels/:channelId/messages',
  schema: GetChannelMessagesApi.Request.Schema,
  handler: async (req, res) => {
    const messages = await channelController.getChannelMessagesPaginated(
      req.params.channelId,
      req.params.serverId,
      req.query.from,
      req.query.limit,
      req.user.username
    )
    const response = new GetChannelMessagesApi.Responses.Success(messages)
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ChannelControllerExceptions.UserNotAuthorized,
      onException(e, req, res) {
        res.sendResponse(new GetChannelMessagesApi.Errors.UserNotAuthorized())
      },
    },
    {
      exception: ChannelControllerExceptions.ServerNotFound,
      onException(e, req, res) {
        res.sendResponse(new GetChannelMessagesApi.Errors.ServerNotFound())
      },
    },
    {
      exception: ChannelControllerExceptions.ChannelNotFound,
      onException(e, req, res) {
        res.sendResponse(new GetChannelMessagesApi.Errors.ChannelNotFound())
      },
    },
  ],
})

const SendMessageInChannelApiRoute = new Route<
  SendMessageInChannelApi.Response,
  SendMessageInChannelApi.Request.Params,
  SendMessageInChannelApi.Request.Body
>({
  method: 'post',
  path: '/:serverId/channels/:channelId/messages',
  schema: SendMessageInChannelApi.Request.Schema,
  handler: async (req, res) => {
    await channelController.sendMessage(
      req.params.channelId,
      req.params.serverId,
      req.user.username,
      req.body.content
    )
    const response = new SendMessageInChannelApi.Responses.Success()
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ChannelControllerExceptions.ServerNotFound,
      onException(e, req, res) {
        res.sendResponse(new SendMessageInChannelApi.Errors.ServerNotFound())
      },
    },
    {
      exception: ChannelControllerExceptions.ChannelNotFound,
      onException(e, req, res) {
        res.sendResponse(new SendMessageInChannelApi.Errors.ChannelNotFound())
      },
    },
    {
      exception: ChannelControllerExceptions.UserNotAuthorized,
      onException(e, req, res) {
        res.sendResponse(new SendMessageInChannelApi.Errors.UserNotAuthorized())
      },
    },
  ],
})

export const channelRouter = Router({
  mergeParams: true,
  strict: true,
})

GetChannelMessagesApiRoute.attachToRouter(channelRouter)
SendMessageInChannelApiRoute.attachToRouter(channelRouter)
