import { Router } from 'express'
import {
  ServerController,
  ServerControllerExceptions,
} from '@controllers/server/server-controller'
import { ServerControllerImpl } from '@controllers/server/server-controller-impl'
import {
  GetServersApi,
  CreateServerApi,
  GetServerApi,
  UpdateServerApi,
  DeleteServerApi,
  JoinServerApi,
  LeaveServerApi,
  GetServerParticipantsApi,
  KickUserFromServerApi,
} from '@api/piperchat/server'
import { Route } from '@commons/route'

const serverController: ServerController = new ServerControllerImpl()
export const serverRouter = Router({
  strict: true,
  mergeParams: true,
})

const GetServerParticipantsApiRoute = new Route<
  GetServerParticipantsApi.Response,
  GetServerParticipantsApi.Request.Params,
  GetServerParticipantsApi.Request.Body
>({
  method: 'get',
  path: '/:serverId/participants',
  schema: GetServerParticipantsApi.Request.Schema,
  handler: async (req, res) => {
    const participants = await serverController.getServerParticipants(
      req.params.serverId,
      req.user.username
    )
    const response = new GetServerParticipantsApi.Responses.Success(participants)
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ServerControllerExceptions.ServerNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new GetServerParticipantsApi.Errors.ServerNotFound())
      },
    },
    {
      exception: ServerControllerExceptions.UserNotAuthorized,
      onException: (e, req, res) => {
        res.sendResponse(new GetServerParticipantsApi.Errors.UserNotAuthorized())
      },
    },
  ],
})

const JoinServerApiRoute = new Route<
  JoinServerApi.Response,
  JoinServerApi.Request.Params,
  JoinServerApi.Request.Body
>({
  method: 'post',
  path: '/:serverId/participants',
  schema: JoinServerApi.Request.Schema,
  handler: async (req, res) => {
    await serverController.joinServer(req.params.serverId, req.user.username)
    const response = new JoinServerApi.Responses.Success()
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ServerControllerExceptions.ServerNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new JoinServerApi.Errors.ServerNotFound())
      },
    },
    {
      exception: ServerControllerExceptions.UserAlreadyJoined,
      onException: (e, req, res) => {
        res.sendResponse(new JoinServerApi.Errors.UserAlreadyJoined())
      },
    },
  ],
})

const LeaveServerApiRoute = new Route<
  LeaveServerApi.Response,
  LeaveServerApi.Request.Params,
  LeaveServerApi.Request.Body
>({
  method: 'delete',
  path: '/:serverId/participants',
  schema: LeaveServerApi.Request.Schema,
  handler: async (req, res) => {
    await serverController.leaveServer(req.params.serverId, req.user.username)
    const response = new LeaveServerApi.Responses.Success()
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ServerControllerExceptions.ServerNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new LeaveServerApi.Errors.ServerNotFound())
      },
    },
    {
      exception: ServerControllerExceptions.UserNotAuthorized,
      onException: (e, req, res) => {
        res.sendResponse(new LeaveServerApi.Errors.UserNotInServer())
      },
    },
    {
      exception: ServerControllerExceptions.OwnerCannotLeave,
      onException: (e, req, res) => {
        res.sendResponse(new LeaveServerApi.Errors.OwnerCannotLeave())
      },
    },
  ],
})

const KickUserFromServerApiRoute = new Route<
  KickUserFromServerApi.Response,
  KickUserFromServerApi.Request.Params,
  KickUserFromServerApi.Request.Body
>({
  method: 'delete',
  path: '/:serverId/participants/:username',
  schema: KickUserFromServerApi.Request.Schema,
  handler: async (req, res) => {
    await serverController.kickUserFromTheServer(
      req.params.serverId,
      req.params.username,
      req.user.username
    )
    const response = new KickUserFromServerApi.Responses.Success()
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ServerControllerExceptions.ServerNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new KickUserFromServerApi.Errors.ServerNotFound())
      },
    },
    {
      exception: ServerControllerExceptions.UserNotAuthorized,
      onException: (e, req, res) => {
        res.sendResponse(new KickUserFromServerApi.Errors.UserNotAuthorized())
      },
    },
    {
      exception: ServerControllerExceptions.OwnerCannotLeave,
      onException: (e, req, res) => {
        res.sendResponse(new KickUserFromServerApi.Errors.OwnerCannotLeave())
      },
    },
  ],
})

const GetServerApiRoute = new Route<
  GetServerApi.Response,
  GetServerApi.Request.Params,
  GetServerApi.Request.Body
>({
  method: 'get',
  path: '/:serverId',
  schema: GetServerApi.Request.Schema,
  handler: async (req, res) => {
    const server = await serverController.getServer(req.params.serverId)
    if (!server.participants.includes(req.user.username)) {
      throw new ServerControllerExceptions.UserNotAuthorized()
    }
    const response = new GetServerApi.Responses.Success(server)
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ServerControllerExceptions.ServerNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new GetServerApi.Errors.ServerNotFound())
      },
    },
    {
      exception: ServerControllerExceptions.UserNotAuthorized,
      onException: (e, req, res) => {
        res.sendResponse(new GetServerApi.Errors.UserNotAuthorized())
      },
    },
  ],
})

const UpdateServerApiRoute = new Route<
  UpdateServerApi.Response,
  UpdateServerApi.Request.Params,
  UpdateServerApi.Request.Body
>({
  method: 'put',
  path: '/:serverId',
  schema: UpdateServerApi.Request.Schema,
  handler: async (req, res) => {
    await serverController.updateServer(
      req.params.serverId,
      req.user.username,
      req.body.name,
      req.body.description
    )
    const response = new UpdateServerApi.Responses.Success()
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ServerControllerExceptions.ServerNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new UpdateServerApi.Errors.ServerNotFound())
      },
    },
    {
      exception: ServerControllerExceptions.UserNotAuthorized,
      onException: (e, req, res) => {
        res.sendResponse(new UpdateServerApi.Errors.UserNotAuthorized())
      },
    },
  ],
})

const DeleteServerApiRoute = new Route<
  DeleteServerApi.Response,
  DeleteServerApi.Request.Params,
  DeleteServerApi.Request.Body
>({
  method: 'delete',
  path: '/:serverId',
  schema: DeleteServerApi.Request.Schema,
  handler: async (req, res) => {
    await serverController.deleteServer(req.params.serverId, req.user.username)
    res.sendResponse(new DeleteServerApi.Responses.Success())
  },
  exceptions: [
    {
      exception: ServerControllerExceptions.ServerNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new DeleteServerApi.Errors.ServerNotFound())
      },
    },
    {
      exception: ServerControllerExceptions.UserNotAuthorized,
      onException: (e, req, res) => {
        res.sendResponse(new DeleteServerApi.Errors.UserNotAuthorized())
      },
    },
  ],
})

const GetServersApiRoute = new Route<
  GetServersApi.Response,
  GetServersApi.Request.Params,
  GetServersApi.Request.Body
>({
  method: 'get',
  path: '/',
  schema: GetServersApi.Request.Schema,
  handler: async (req, res) => {
    const servers = await serverController.getServers(req.user.username)
    const response = new GetServersApi.Responses.Success(servers)
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: ServerControllerExceptions.UserNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new GetServersApi.Errors.UserNotFound())
      },
    },
  ],
})

const CreateServerApiRoute = new Route<
  CreateServerApi.Response,
  CreateServerApi.Request.Params,
  CreateServerApi.Request.Body
>({
  method: 'post',
  path: '/',
  schema: CreateServerApi.Request.Schema,
  handler: async (req, res) => {
    const server = await serverController.createServer(
      req.body.name,
      req.body.description,
      req.user.username
    )
    const response = new CreateServerApi.Responses.Success(server.id)
    res.sendResponse(response)
  },
})

GetServerParticipantsApiRoute.attachToRouter(serverRouter)
JoinServerApiRoute.attachToRouter(serverRouter)
LeaveServerApiRoute.attachToRouter(serverRouter)
KickUserFromServerApiRoute.attachToRouter(serverRouter)

GetServerApiRoute.attachToRouter(serverRouter)
UpdateServerApiRoute.attachToRouter(serverRouter)
DeleteServerApiRoute.attachToRouter(serverRouter)
GetServersApiRoute.attachToRouter(serverRouter)
CreateServerApiRoute.attachToRouter(serverRouter)
