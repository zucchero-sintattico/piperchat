import { JWTAuthenticationMiddleware } from '@commons/utils/jwt'
import {
  GetChannelSessionIdApi,
  GetDirectSessionIdApi,
  GetUsersInSession,
} from '@api/webrtc/session'
import {
  FriendshipRepository,
  FriendshipRepositoryImpl,
} from '@/repositories/friendship-repository'
import {
  ChannelRepository,
  ChannelRepositoryImpl,
} from '@/repositories/channel-repository'
import {
  SessionRepository,
  SessionRepositoryImpl,
} from '@/repositories/session-repository'
import { Route } from '@commons/route'
import { Router } from 'express'

const friendshipRepository: FriendshipRepository = new FriendshipRepositoryImpl()
const channelRepository: ChannelRepository = new ChannelRepositoryImpl()
const sessionRepository: SessionRepository = new SessionRepositoryImpl()

export const GetDirectSessionIdApiRoute = new Route<
  GetDirectSessionIdApi.Response,
  GetDirectSessionIdApi.Request.Params
>({
  method: 'get',
  path: '/users/:username/session',
  schema: GetDirectSessionIdApi.Request.Schema,
  handler: async (req, res) => {
    if (
      !(await friendshipRepository.existsFriendship(
        req.user.username,
        req.params.username
      ))
    ) {
      const response = new GetDirectSessionIdApi.Errors.FriendshipNotFound()
      res.sendResponse(response)
    }

    const sessionId = await friendshipRepository.getFriendshipSessionId(
      req.user.username,
      req.params.username
    )

    const response = new GetDirectSessionIdApi.Responses.Success({ sessionId })
    res.sendResponse(response)
  },
})

export const GetChannelSessionIdApiRoute = new Route<
  GetChannelSessionIdApi.Response,
  GetChannelSessionIdApi.Request.Params
>({
  method: 'get',
  path: '/servers/:serverId/channels/:channelId/session',
  schema: GetChannelSessionIdApi.Request.Schema,
  handler: async (req, res) => {
    const channel = await channelRepository.getChannelInServer(
      req.params.serverId,
      req.params.channelId
    )

    const response = new GetChannelSessionIdApi.Responses.Success({
      sessionId: channel.sessionId,
    })
    res.sendResponse(response)
  },
})

export const GetUsersInSessionRoute = new Route<
  GetUsersInSession.Response,
  GetUsersInSession.Request.Params
>({
  method: 'get',
  path: '/sessions/:sessionId',
  schema: GetUsersInSession.Request.Schema,
  handler: async (req, res) => {
    const session = await sessionRepository.getSession(req.params.sessionId)
    const response = new GetUsersInSession.Responses.Success({
      users: session.participants.map((p) => p.username),
    })
    res.sendResponse(response)
  },
})

export const serviceRouter = Router()
serviceRouter.use(JWTAuthenticationMiddleware)

GetDirectSessionIdApiRoute.attachToRouter(serviceRouter)
GetChannelSessionIdApiRoute.attachToRouter(serviceRouter)
GetUsersInSessionRoute.attachToRouter(serviceRouter)
