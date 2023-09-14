import { Router } from 'express'
import {
  ChannelController,
  ChannelControllerExceptions,
} from '@controllers/channel/channel-controller'
import { ChannelControllerImpl } from '@controllers/channel/channel-controller-impl'
import { ServerControllerExceptions } from '@controllers/server/server-controller'
import {
  GetChannelsApi,
  CreateChannelApi,
  GetChannelByIdApi,
  UpdateChannelApi,
  DeleteChannelApi,
} from '@api/piperchat/channel'
import { Route } from '@commons/router'

const channelController: ChannelController = new ChannelControllerImpl()

export const GetChannelsApiRoute = new Route<
  GetChannelsApi.Response,
  GetChannelsApi.Request.Params
>({
  method: 'get',
  path: '/',
  schema: GetChannelsApi.Request.Schema,
  handler: async (req, res) => {
    const channels = await channelController.getChannels(
      req.params.serverId,
      req.user.username
    )
    const response = new GetChannelsApi.Responses.Success(channels)
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ServerControllerExceptions.ServerNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new GetChannelsApi.Errors.ServerNotFound())
      },
    },
    {
      exception: ServerControllerExceptions.UserNotAuthorized,
      onException: (e, req, res) => {
        res.sendResponse(new GetChannelsApi.Errors.UserNotAuthorized())
      },
    },
  ],
})

export const GetChannelByIdApiRoute = new Route<
  GetChannelByIdApi.Response,
  GetChannelByIdApi.Request.Params
>({
  method: 'get',
  path: '/:channelId',
  schema: GetChannelByIdApi.Request.Schema,
  handler: async (req, res) => {
    const channel = await channelController.getChannelById(
      req.params.serverId,
      req.params.channelId,
      req.user.username
    )
    const response = new GetChannelByIdApi.Responses.Success(channel)
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ChannelControllerExceptions.UserNotAuthorized,
      onException: (e, req, res) => {
        res.sendResponse(new GetChannelByIdApi.Errors.UserNotAuthorized())
      },
    },
    {
      exception: ChannelControllerExceptions.ChannelNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new GetChannelByIdApi.Errors.ChannelNotFound())
      },
    },
  ],
})

export const CreateChannelApiRoute = new Route<
  CreateChannelApi.Response,
  CreateChannelApi.Request.Params,
  CreateChannelApi.Request.Body
>({
  method: 'post',
  path: '/',
  schema: CreateChannelApi.Request.Schema,
  handler: async (req, res) => {
    await channelController.createChannel(
      req.params.serverId,
      req.user.username,
      req.body.name,
      req.body.channelType,
      req.body.description
    )
    const response = new CreateChannelApi.Responses.Success()
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ServerControllerExceptions.ServerNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new CreateChannelApi.Errors.ServerNotFound())
      },
    },
    {
      exception: ServerControllerExceptions.UserNotAuthorized,
      onException: (e, req, res) => {
        res.sendResponse(new CreateChannelApi.Errors.UserNotAuthorized())
      },
    },
  ],
})

export const UpdateChannelApiRoute = new Route<
  UpdateChannelApi.Response,
  UpdateChannelApi.Request.Params,
  UpdateChannelApi.Request.Body
>({
  method: 'put',
  path: '/:channelId',
  schema: UpdateChannelApi.Request.Schema,
  handler: async (req, res) => {
    await channelController.updateChannel(
      req.params.serverId,
      req.params.channelId,
      req.user.username,
      req.body.name,
      req.body.description
    )
    const response = new UpdateChannelApi.Responses.Success()
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ChannelControllerExceptions.ChannelNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new UpdateChannelApi.Errors.ChannelNotFound())
      },
    },
    {
      exception: UpdateChannelApi.Errors.UserNotAuthorized,
      onException: (e, req, res) => {
        res.sendResponse(new UpdateChannelApi.Errors.UserNotAuthorized())
      },
    },
  ],
})

export const DeleteChannelApiRoute = new Route<
  DeleteChannelApi.Response,
  DeleteChannelApi.Request.Params,
  DeleteChannelApi.Request.Body
>({
  method: 'delete',
  path: '/:channelId',
  schema: DeleteChannelApi.Request.Schema,
  handler: async (req, res) => {
    await channelController.deleteChannel(
      req.params.serverId,
      req.params.channelId,
      req.user.username
    )
    const response = new DeleteChannelApi.Responses.Success()
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ChannelControllerExceptions.ChannelNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new DeleteChannelApi.Errors.ChannelNotFound())
      },
    },
    {
      exception: DeleteChannelApi.Errors.UserNotAuthorized,
      onException: (e, req, res) => {
        res.sendResponse(new DeleteChannelApi.Errors.UserNotAuthorized())
      },
    },
  ],
})

export const channelRouter = Router({
  mergeParams: true,
  strict: true,
})
GetChannelsApiRoute.attachToRouter(channelRouter)
GetChannelByIdApiRoute.attachToRouter(channelRouter)
CreateChannelApiRoute.attachToRouter(channelRouter)
UpdateChannelApiRoute.attachToRouter(channelRouter)
DeleteChannelApiRoute.attachToRouter(channelRouter)
