import { Request, Response, Router } from 'express'
import {
  ServerController,
  ServerControllerExceptions,
} from '@controllers/server/server-controller'
import { ServerControllerImpl } from '@controllers/server/server-controller-impl'

const serverController: ServerController = new ServerControllerImpl()
export const serverRouter = Router()

import * as Api from '@piperchat/commons/src/api/index'
import ApiErrors = Api.Errors
import KickUserFromServerApi = Api.Piperchat.Server.KickUserFromServer
import GetServerParticipantsApi = Api.Piperchat.Server.GetServerParticipants
import JoinServerApi = Api.Piperchat.Server.JoinServer
import LeftServerApi = Api.Piperchat.Server.LeftServer
import GetServerApi = Api.Piperchat.Server.GetServer
import UpdateServerApi = Api.Piperchat.Server.UpdateServer
import DeleteServerApi = Api.Piperchat.Server.DeleteServer
import GetServersApi = Api.Piperchat.Server.GetServers
import CreateServerApi = Api.Piperchat.Server.CreateServer

serverRouter.delete(
  '/:serverId/partecipants/:username',
  Api.Validate(KickUserFromServerApi.Request.Schema),
  async (
    req: Request<
      KickUserFromServerApi.Request.Params,
      KickUserFromServerApi.Response,
      KickUserFromServerApi.Request.Body
    >,
    res: Response<KickUserFromServerApi.Response | ApiErrors.InternalServerError>
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
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.get(
  '/:serverId/partecipants',
  Api.Validate(GetServerParticipantsApi.Request.Schema),
  async (
    req: Request<
      GetServerParticipantsApi.Request.Params,
      GetServerParticipantsApi.Response,
      GetServerParticipantsApi.Request.Body
    >,
    res: Response<GetServerParticipantsApi.Response | ApiErrors.InternalServerError>
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
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.post(
  '/:serverId/partecipants',
  Api.Validate(JoinServerApi.Request.Schema),
  async (
    req: Request<
      JoinServerApi.Request.Params,
      JoinServerApi.Response,
      JoinServerApi.Request.Body
    >,
    res: Response<JoinServerApi.Response | ApiErrors.InternalServerError>
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
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.delete(
  '/:serverId/partecipants',
  Api.Validate(LeftServerApi.Request.Schema),
  async (
    req: Request<
      LeftServerApi.Request.Params,
      LeftServerApi.Response,
      LeftServerApi.Request.Body
    >,
    res: Response<LeftServerApi.Response | ApiErrors.InternalServerError>
  ) => {
    try {
      await serverController.leaveServer(req.params.serverId, req.user.username)
      const response = new LeftServerApi.Responses.Success()
      response.send(res)
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        const response = new LeftServerApi.Errors.ServerNotFound()
        response.send(res)
      } else if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        const response = new LeftServerApi.Errors.UserNotInServer()
        response.send(res)
      } else if (e instanceof ServerControllerExceptions.OwnerCannotLeave) {
        const response = new LeftServerApi.Errors.OwnerCannotLeave()
        response.send(res)
      } else {
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.get(
  '/:serverId',
  Api.Validate(GetServerApi.Request.Schema),
  async (
    req: Request<
      GetServerApi.Request.Params,
      GetServerApi.Response,
      GetServerApi.Request.Body
    >,
    res: Response<GetServerApi.Response | ApiErrors.InternalServerError>
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
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.put(
  '/:serverId',
  Api.Validate(UpdateServerApi.Request.Schema),
  async (
    req: Request<
      UpdateServerApi.Request.Params,
      UpdateServerApi.Response,
      UpdateServerApi.Request.Body
    >,
    res: Response<UpdateServerApi.Response | ApiErrors.InternalServerError>
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
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.delete(
  '/:serverId',
  Api.Validate(DeleteServerApi.Request.Schema),
  async (
    req: Request<
      DeleteServerApi.Request.Params,
      DeleteServerApi.Response,
      DeleteServerApi.Request.Body
    >,
    res: Response<DeleteServerApi.Response | ApiErrors.InternalServerError>
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
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.get(
  '/',
  Api.Validate(GetServersApi.Request.Schema),
  async (
    req: Request<
      GetServersApi.Request.Params,
      GetServersApi.Response,
      GetServersApi.Request.Body
    >,
    res: Response<GetServersApi.Response | ApiErrors.InternalServerError>
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
        const response = new ApiErrors.InternalServerError(e)
        response.send(res)
      }
    }
  }
)

serverRouter.post(
  '/',
  Api.Validate(CreateServerApi.Request.Schema),
  async (
    req: Request<
      CreateServerApi.Request.Params,
      CreateServerApi.Response,
      CreateServerApi.Request.Body
    >,
    res: Response<CreateServerApi.Response | ApiErrors.InternalServerError>
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
      const response = new ApiErrors.InternalServerError(e)
      response.send(res)
    }
  }
)
