import { Router, Request, Response } from 'express'
import { ChannelController } from '@controllers/channel/channel-controller'
import { ChannelControllerImpl } from '@controllers/channel/channel-controller-impl'
import { ServerControllerExceptions } from '@controllers/server/server-controller'

const channelController: ChannelController = new ChannelControllerImpl()
export const channelRouter = Router()

import { Validate } from '@api/validate'
import { InternalServerError } from '@api/errors'
import { GetChannelsApi, CreateChannelApi } from '@api/piperchat/channel'

channelRouter.get(
  '/',
  Validate(GetChannelsApi.Request.Schema),
  async (
    req: Request<
      GetChannelsApi.Request.Params,
      GetChannelsApi.Response,
      GetChannelsApi.Request.Body
    >,
    res: Response<GetChannelsApi.Response | InternalServerError>
  ) => {
    try {
      const channels = await channelController.getChannels(
        req.params.serverId,
        req.user.username
      )
      const response = new GetChannelsApi.Responses.Success(channels)
      response.send(res)
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        const response = new GetChannelsApi.Errors.ServerNotFound()
        response.send(res)
      } else if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        const response = new GetChannelsApi.Errors.UserNotAuthorized()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

channelRouter.post(
  '/',
  Validate(CreateChannelApi.Request.Schema),
  async (
    req: Request<
      CreateChannelApi.Request.Params,
      CreateChannelApi.Response,
      CreateChannelApi.Request.Body
    >,
    res: Response<CreateChannelApi.Response | InternalServerError>
  ) => {
    try {
      await channelController.createChannel(
        req.params.serverId,
        req.user.username,
        req.body.name,
        req.body.channelType,
        req.body.description
      )
      const response = new CreateChannelApi.Responses.Success()
      response.send(res)
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        const response = new CreateChannelApi.Errors.ServerNotFound()
        response.send(res)
      } else if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        const response = new CreateChannelApi.Errors.UserNotAuthorized()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)
