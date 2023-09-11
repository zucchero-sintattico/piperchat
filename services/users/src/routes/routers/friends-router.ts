import { Request, Response, Router } from 'express'
import {
  FriendsController,
  FriendsControllerExceptions,
} from '@controllers/friends/friends-controller'
import { FriendsControllerImpl } from '@controllers/friends/friends-controller-impl'
import { JWTAuthenticationMiddleware } from '@commons/jwt'

import { InternalServerError } from '@api/errors'
import { Validate } from '@api/validate'
import {
  GetFriendsRequestsApi,
  SendFriendRequestApi,
  GetFriendsApi,
} from '@api/users/friends'

const friendsController: FriendsController = new FriendsControllerImpl()

export const friendsRouter = Router()
friendsRouter.use(JWTAuthenticationMiddleware)

friendsRouter.get(
  '/',
  Validate(GetFriendsApi.Request.Schema),
  async (
    req: Request<
      GetFriendsApi.Request.Params,
      GetFriendsApi.Response,
      GetFriendsApi.Request.Body
    >,
    res: Response<GetFriendsApi.Response | InternalServerError>
  ) => {
    try {
      const friends = await friendsController.getFriends(req.user.username)
      const response = new GetFriendsApi.Responses.Success(friends)
      response.send(res)
    } catch (e) {
      if (e instanceof FriendsControllerExceptions.UserNotFound) {
        const response = new GetFriendsApi.Errors.UserNotFound()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

friendsRouter.get(
  '/requests',
  Validate(GetFriendsRequestsApi.Request.Schema),
  async (
    req: Request<
      GetFriendsRequestsApi.Request.Params,
      GetFriendsRequestsApi.Response,
      GetFriendsRequestsApi.Request.Body
    >,
    res: Response<GetFriendsRequestsApi.Response | InternalServerError>
  ) => {
    try {
      const requests = await friendsController.getFriendsRequests(req.user.username)
      const response = new GetFriendsRequestsApi.Responses.Success(requests)
      response.send(res)
    } catch (e) {
      if (e instanceof FriendsControllerExceptions.UserNotFound) {
        const response = new GetFriendsRequestsApi.Errors.UserNotFound()
        response.send(res)
      } else {
        const response = new InternalServerError(e)
        response.send(res)
      }
    }
  }
)

friendsRouter.post(
  '/requests',
  Validate(SendFriendRequestApi.Request.Schema),
  async (
    req: Request<
      SendFriendRequestApi.Request.Params,
      SendFriendRequestApi.Response,
      SendFriendRequestApi.Request.Body
    >,
    res: Response<SendFriendRequestApi.Response | InternalServerError>
  ) => {
    if (
      !Object.values(SendFriendRequestApi.Request.FriendRequestAction).includes(
        req.body.action
      )
    ) {
      const response = new SendFriendRequestApi.Errors.InvalidAction(req.body.action)
      response.send(res)
    }

    switch (req.body.action) {
      case SendFriendRequestApi.Request.FriendRequestAction.send:
        try {
          await friendsController.sendFriendRequest(req.user.username, req.body.to)
          const response = new SendFriendRequestApi.Responses.Success()
          response.send(res)
        } catch (e) {
          if (e instanceof FriendsControllerExceptions.UserNotFound) {
            const response = new SendFriendRequestApi.Errors.UserNotFound()
            response.send(res)
          } else if (e instanceof FriendsControllerExceptions.FriendRequestAlreadySent) {
            const response = new SendFriendRequestApi.Errors.FriendRequestAlreadySent()
            response.send(res)
          } else {
            const response = new InternalServerError(e)
            response.send(res)
          }
        }
        break
      case SendFriendRequestApi.Request.FriendRequestAction.accept:
        try {
          await friendsController.acceptFriendRequest(req.user.username, req.body.to)
          const response = new SendFriendRequestApi.Responses.FriendRequestAccepted()
          response.send(res)
        } catch (e) {
          if (e instanceof FriendsControllerExceptions.UserNotFound) {
            const response = new SendFriendRequestApi.Errors.UserNotFound()
            response.send(res)
          } else if (e instanceof FriendsControllerExceptions.FriendRequestNotPresent) {
            const response = new SendFriendRequestApi.Errors.FriendRequestNotFound()
            response.send(res)
          } else {
            const response = new InternalServerError(e)
            response.send(res)
          }
        }
        break
      case SendFriendRequestApi.Request.FriendRequestAction.deny:
        try {
          await friendsController.denyFriendRequest(req.user.username, req.body.to)
          const response = new SendFriendRequestApi.Responses.FriendRequestDenied()
          response.send(res)
        } catch (e) {
          if (e instanceof FriendsControllerExceptions.UserNotFound) {
            const response = new SendFriendRequestApi.Errors.UserNotFound()
            response.send(res)
          } else if (e instanceof FriendsControllerExceptions.FriendRequestNotPresent) {
            const response = new SendFriendRequestApi.Errors.FriendRequestNotFound()
            response.send(res)
          } else {
            const response = new InternalServerError(e)
            response.send(res)
          }
        }
    }
  }
)
