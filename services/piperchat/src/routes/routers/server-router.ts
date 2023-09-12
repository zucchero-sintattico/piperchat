import { Request, Response, Router } from 'express'
import {
  ServerController,
  ServerControllerExceptions,
} from '@controllers/server/server-controller'
import { ServerControllerImpl } from '@controllers/server/server-controller-impl'

const serverController: ServerController = new ServerControllerImpl()
export const serverRouter = Router()

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

serverRouter.get(
  '/:serverId',
  Validate(GetServerApi.Request.Schema),
  async (
    req: Request<
      GetServerApi.Request.Params,
      GetServerApi.Response,
      GetServerApi.Request.Body
    >,
    res: Response<GetServerApi.Response | InternalServerError>
  ) => {
    try {
      const server = await serverController.getServer(req.params.serverId)
      const response = new GetServerApi.Responses.Success(server)
      response.send(res)
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        const response = new GetServerApi.Errors.ServerNotFound()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.put(
  '/:serverId',
  Validate(UpdateServerApi.Request.Schema),
  async (
    req: Request<
      UpdateServerApi.Request.Params,
      UpdateServerApi.Response,
      UpdateServerApi.Request.Body
    >,
    res: Response<UpdateServerApi.Response | InternalServerError>
  ) => {
    if (req.body.name == undefined && req.body.description == undefined) {
      const response = new UpdateServerApi.Errors.NameOrDescriptionRequired()
      response.send(res)
    }
    try {
      await serverController.updateServer(
        req.params.serverId,
        req.user.username,
        req.body.name,
        req.body.description
      )
      const response = new UpdateServerApi.Responses.Success()
      response.send(res)
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        const response = new UpdateServerApi.Errors.ServerNotFound()
        response.send(res)
      } else if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        const response = new UpdateServerApi.Errors.UserNotAuthorized()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.delete(
  '/:serverId',
  Validate(DeleteServerApi.Request.Schema),
  async (
    req: Request<
      DeleteServerApi.Request.Params,
      DeleteServerApi.Response,
      DeleteServerApi.Request.Body
    >,
    res: Response<DeleteServerApi.Response | InternalServerError>
  ) => {
    try {
      await serverController.deleteServer(req.params.serverId, req.user.username)
      const response = new DeleteServerApi.Responses.Success()
      response.send(res)
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        const response = new DeleteServerApi.Errors.ServerNotFound()
        response.send(res)
      } else if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        const response = new DeleteServerApi.Errors.UserNotAuthorized()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.get(
  '/',
  Validate(GetServersApi.Request.Schema),
  async (
    req: Request<
      GetServersApi.Request.Params,
      GetServersApi.Response,
      GetServersApi.Request.Body
    >,
    res: Response<GetServersApi.Response | InternalServerError>
  ) => {
    try {
      const servers = await serverController.getServers(req.user.username)
      const response = new GetServersApi.Responses.Success(servers)
      response.send(res)
    } catch (e) {
      if (e instanceof ServerControllerExceptions.UserNotFound) {
        const response = new GetServersApi.Errors.UserNotFound()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.post(
  '/',
  Validate(CreateServerApi.Request.Schema),
  async (
    req: Request<
      CreateServerApi.Request.Params,
      CreateServerApi.Response,
      CreateServerApi.Request.Body
    >,
    res: Response<CreateServerApi.Response | InternalServerError>
  ) => {
    try {
      await serverController.createServer(
        req.body.name,
        req.body.description,
        req.user.username
      )
      const response = new CreateServerApi.Responses.Success()
      response.send(res)
    } catch (e) {
      const response = new InternalServerError(e)
      response.send(res)
    }
  }
)
