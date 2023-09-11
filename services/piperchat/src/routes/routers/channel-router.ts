import { Router, Request, Response } from 'express'
import {
  ChannelController,
  ChannelControllerExceptions,
} from '@controllers/channel/channel-controller'
import { ChannelControllerImpl } from '@controllers/channel/channel-controller-impl'
import { ServerControllerExceptions } from '@controllers/server/server-controller'

const channelController: ChannelController = new ChannelControllerImpl()
export const channelRouter = Router()

import { Validate } from '@api/validate'
import { InternalServerError } from '@api/errors'
import {
  GetChannelsApi,
  CreateChannelApi,
  GetChannelByIdApi,
  UpdateChannelApi,
  DeleteChannelApi,
} from '@api/piperchat/channel'

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

channelRouter.get(
  '/:channelId',
  Validate(GetChannelByIdApi.Request.Schema),
  async (
    req: Request<
      GetChannelByIdApi.Request.Params,
      GetChannelByIdApi.Response,
      GetChannelByIdApi.Request.Body
    >,
    res: Response<GetChannelByIdApi.Response | InternalServerError>
  ) => {
    try {
      const channel = await channelController.getChannelById(
        req.params.serverId,
        req.params.channelId,
        req.user.username
      )
      const response = new GetChannelByIdApi.Responses.Success(channel)
      response.send(res)
    } catch (e) {
      if (e instanceof ChannelControllerExceptions.UserNotAuthorized) {
        const response = new GetChannelByIdApi.Errors.UserNotAuthorized()
        response.send(res)
      } else if (e instanceof ChannelControllerExceptions.ChannelNotFound) {
        const response = new GetChannelByIdApi.Errors.ChannelNotFound()
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

channelRouter.put(
  '/:channelId',
  Validate(UpdateChannelApi.Request.Schema),
  async (
    req: Request<
      UpdateChannelApi.Request.Params,
      UpdateChannelApi.Response,
      UpdateChannelApi.Request.Body
    >,
    res: Response<UpdateChannelApi.Response | InternalServerError>
  ) => {
    try {
      await channelController.updateChannel(
        req.params.serverId,
        req.params.channelId,
        req.user.username,
        req.body.name,
        req.body.description
      )
      const response = new UpdateChannelApi.Responses.Success()
      response.send(res)
    } catch (e) {
      if (e instanceof ChannelControllerExceptions.ChannelNotFound) {
        const response = new UpdateChannelApi.Errors.ChannelNotFound()
        response.send(res)
      } else if (e instanceof UpdateChannelApi.Errors.UserNotAuthorized) {
        const response = new UpdateChannelApi.Errors.UserNotAuthorized()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

channelRouter.delete(
  '/:channelId',
  Validate(DeleteChannelApi.Request.Schema),
  async (
    req: Request<
      DeleteChannelApi.Request.Params,
      DeleteChannelApi.Response,
      DeleteChannelApi.Request.Body
    >,
    res: Response<DeleteChannelApi.Response | InternalServerError>
  ) => {
    try {
      await channelController.deleteChannel(
        req.params.serverId,
        req.params.channelId,
        req.user.username
      )
      const response = new DeleteChannelApi.Responses.Success()
      response.send(res)
    } catch (e) {
      if (e instanceof DeleteChannelApi.Errors.ChannelNotFound) {
        const response = new DeleteChannelApi.Errors.ChannelNotFound()
        response.send(res)
      } else if (e instanceof DeleteChannelApi.Errors.UserNotAuthorized) {
        const response = new DeleteChannelApi.Errors.UserNotAuthorized()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)
