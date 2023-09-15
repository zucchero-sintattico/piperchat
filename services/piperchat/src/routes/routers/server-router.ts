import { Request, Response, Router } from 'express'
import {
  ServerController,
  ServerControllerExceptions,
} from '@controllers/server/server-controller'
import { ServerControllerImpl } from '@controllers/server/server-controller-impl'
import { Validate } from '@api/validate'
import { InternalServerError } from '@api/errors'
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
import { Route } from '@commons/router'

const serverController: ServerController = new ServerControllerImpl()
export const serverRouter = Router({
  strict: true,
  mergeParams: true,
})

serverRouter.delete(
  '/:serverId/participants/:username',
  Validate(KickUserFromServerApi.Request.Schema),
  async (
    req: Request<
      KickUserFromServerApi.Request.Params,
      KickUserFromServerApi.Response,
      KickUserFromServerApi.Request.Body
    >,
    res: Response<KickUserFromServerApi.Response | InternalServerError>
  ) => {
    try {
      await serverController.kickUserFromTheServer(
        req.params.serverId,
        req.params.username,
        req.user.username
      )
      const response = new KickUserFromServerApi.Responses.Success()
      response.send(res)
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        const response = new KickUserFromServerApi.Errors.ServerNotFound()
        response.send(res)
      } else if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        const response = new KickUserFromServerApi.Errors.UserNotAuthorized()
        response.send(res)
      } else if (e instanceof ServerControllerExceptions.OwnerCannotLeave) {
        const response = new KickUserFromServerApi.Errors.OwnerCannotLeave()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.get(
  '/:serverId/participants',
  Validate(GetServerParticipantsApi.Request.Schema),
  async (
    req: Request<
      GetServerParticipantsApi.Request.Params,
      GetServerParticipantsApi.Response,
      GetServerParticipantsApi.Request.Body
    >,
    res: Response<GetServerParticipantsApi.Response | InternalServerError>
  ) => {
    try {
      const participants = await serverController.getServerParticipants(
        req.params.serverId,
        req.user.username
      )
      const response = new GetServerParticipantsApi.Responses.Success(participants)
      response.send(res)
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        const response = new GetServerParticipantsApi.Errors.ServerNotFound()
        response.send(res)
      } else if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        const response = new GetServerParticipantsApi.Errors.UserNotAuthorized()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.post(
  '/:serverId/participants',
  Validate(JoinServerApi.Request.Schema),
  async (
    req: Request<
      JoinServerApi.Request.Params,
      JoinServerApi.Response,
      JoinServerApi.Request.Body
    >,
    res: Response<JoinServerApi.Response | InternalServerError>
  ) => {
    try {
      await serverController.joinServer(req.params.serverId, req.user.username)
      const response = new JoinServerApi.Responses.Success()
      response.send(res)
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        const response = new JoinServerApi.Errors.ServerNotFound()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.delete(
  '/:serverId/participants',
  Validate(LeaveServerApi.Request.Schema),
  async (
    req: Request<
      LeaveServerApi.Request.Params,
      LeaveServerApi.Response,
      LeaveServerApi.Request.Body
    >,
    res: Response<LeaveServerApi.Response | InternalServerError>
  ) => {
    try {
      await serverController.leaveServer(req.params.serverId, req.user.username)
      const response = new LeaveServerApi.Responses.Success()
      response.send(res)
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        const response = new LeaveServerApi.Errors.ServerNotFound()
        response.send(res)
      } else if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        const response = new LeaveServerApi.Errors.UserNotInServer()
        response.send(res)
      } else if (e instanceof ServerControllerExceptions.OwnerCannotLeave) {
        const response = new LeaveServerApi.Errors.OwnerCannotLeave()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

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
    console.log(server)
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

GetServerApiRoute.attachToRouter(serverRouter)
UpdateServerApiRoute.attachToRouter(serverRouter)
DeleteServerApiRoute.attachToRouter(serverRouter)
GetServersApiRoute.attachToRouter(serverRouter)
CreateServerApiRoute.attachToRouter(serverRouter)
