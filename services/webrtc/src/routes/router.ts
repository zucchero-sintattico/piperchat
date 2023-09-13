import { JWTAuthenticationMiddleware } from '@commons/utils/jwt'
import { Request, Response, Router } from 'express'
import {
  GetChannelSessionIdApi,
  GetDirectSessionIdApi,
  GetUsersInSession,
} from '@api/webrtc/session'
import { Validate } from '@api/validate'
import {
  FriendshipRepository,
  FriendshipRepositoryImpl,
} from '@/repositories/friendship-repository'
import {
  ChannelRepository,
  ChannelRepositoryImpl,
} from '@/repositories/channel-repository'
import { InternalServerError } from '@api/errors'
import {
  SessionRepository,
  SessionRepositoryImpl,
} from '@/repositories/session-repository'

export const serviceRouter = Router()

serviceRouter.use(JWTAuthenticationMiddleware)

const friendshipRepository: FriendshipRepository = new FriendshipRepositoryImpl()
const channelRepository: ChannelRepository = new ChannelRepositoryImpl()
const sessionRepository: SessionRepository = new SessionRepositoryImpl()

serviceRouter.get(
  '/users/:username/session',
  Validate(GetDirectSessionIdApi.Request.Schema),
  async (
    req: Request<GetDirectSessionIdApi.Request.Params, GetDirectSessionIdApi.Response>,
    res: Response<GetDirectSessionIdApi.Response>
  ) => {
    try {
      if (
        !(await friendshipRepository.existsFriendship(
          req.user.username,
          req.params.username
        ))
      ) {
        const response = new GetDirectSessionIdApi.Errors.FriendshipNotFound()
        response.send(res)
      }

      const sessionId = await friendshipRepository.getFriendshipSessionId(
        req.user.username,
        req.params.username
      )

      const response = new GetDirectSessionIdApi.Responses.Success({ sessionId })
      response.send(res)
    } catch (error) {
      const response = new InternalServerError(error)
      response.send(res)
    }
  }
)

serviceRouter.get(
  '/servers/:serverId/channels/:channelId/session',
  Validate(GetChannelSessionIdApi.Request.Schema),
  async (
    req: Request<GetChannelSessionIdApi.Request.Params, GetChannelSessionIdApi.Response>,
    res: Response<GetChannelSessionIdApi.Response>
  ) => {
    try {
      const channel = await channelRepository.getChannelInServer(
        req.params.serverId,
        req.params.channelId
      )

      const response = new GetChannelSessionIdApi.Responses.Success({
        sessionId: channel.sessionId,
      })
      response.send(res)
    } catch (error) {
      const response = new InternalServerError(error)
      response.send(res)
    }
  }
)

serviceRouter.get(
  '/sessions/:sessionId',
  Validate(GetUsersInSession.Request.Schema),
  async (
    req: Request<GetUsersInSession.Request.Params, GetUsersInSession.Response>,
    res: Response<GetUsersInSession.Response>
  ) => {
    try {
      const session = await sessionRepository.getSession(req.params.sessionId)
      const response = new GetUsersInSession.Responses.Success({
        users: session.participants.map((p) => p.username),
      })
      response.send(res)
    } catch (e) {
      const response = new InternalServerError(e)
      response.send(res)
    }
  }
)
