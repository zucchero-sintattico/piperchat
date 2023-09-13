import { JWTAuthenticationMiddleware } from '@commons/utils/jwt'
import { Request, Response, Router } from 'express'
import { GetChannelSessionIdApi, GetDirectSessionIdApi } from '@api/webrtc/session'
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

export const serviceRouter = Router()

serviceRouter.use(JWTAuthenticationMiddleware)

const friendshipRepository: FriendshipRepository = new FriendshipRepositoryImpl()
const channelRepository: ChannelRepository = new ChannelRepositoryImpl()

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
