import {
  FriendsController,
  FriendsControllerExceptions,
} from '@controllers/friends/friends-controller'
import { FriendsControllerImpl } from '@controllers/friends/friends-controller-impl'
import {
  GetFriendsRequestsApi,
  SendFriendRequestApi,
  GetFriendsApi,
} from '@api/users/friends'
import { Route } from '@commons/router'
import { Router } from 'express'
import { JWTAuthenticationMiddleware } from '@commons/utils/jwt'

const friendsController: FriendsController = new FriendsControllerImpl()

export const GetFriendsApiRoute = new Route<
  GetFriendsApi.Response,
  GetFriendsApi.Request.Params,
  GetFriendsApi.Request.Body
>({
  method: 'get',
  path: '/',
  schema: GetFriendsApi.Request.Schema,
  handler: async (req, res) => {
    const friends = await friendsController.getFriends(req.user.username)
    const response = new GetFriendsApi.Responses.Success(friends)
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: FriendsControllerExceptions.UserNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new GetFriendsApi.Errors.UserNotFound())
      },
    },
  ],
})

export const GetFriendsRequestsApiRoute = new Route<
  GetFriendsRequestsApi.Response,
  GetFriendsRequestsApi.Request.Params,
  GetFriendsRequestsApi.Request.Body
>({
  method: 'get',
  path: '/requests',
  schema: GetFriendsRequestsApi.Request.Schema,
  handler: async (req, res) => {
    const requests = await friendsController.getFriendsRequests(req.user.username)
    const response = new GetFriendsRequestsApi.Responses.Success(requests)
    res.sendResponse(response)
  },
  exceptions: [
    {
      exception: FriendsControllerExceptions.UserNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new GetFriendsRequestsApi.Errors.UserNotFound())
      },
    },
  ],
})

export const SendFriendRequestApiRoute = new Route<
  SendFriendRequestApi.Response,
  SendFriendRequestApi.Request.Params,
  SendFriendRequestApi.Request.Body
>({
  method: 'post',
  path: '/requests',
  schema: SendFriendRequestApi.Request.Schema,
  handler: async (req, res) => {
    if (
      !Object.values(SendFriendRequestApi.Request.FriendRequestAction).includes(
        req.body.action
      )
    ) {
      const response = new SendFriendRequestApi.Errors.InvalidAction(req.body.action)
      response.send(res)
    }
    switch (req.body.action) {
      case SendFriendRequestApi.Request.FriendRequestAction.send: {
        await friendsController.sendFriendRequest(req.user.username, req.body.to)
        const response = new SendFriendRequestApi.Responses.Success()
        response.send(res)
        break
      }
      case SendFriendRequestApi.Request.FriendRequestAction.accept: {
        await friendsController.acceptFriendRequest(req.user.username, req.body.to)
        const response = new SendFriendRequestApi.Responses.FriendRequestAccepted()
        response.send(res)
        break
      }
      case SendFriendRequestApi.Request.FriendRequestAction.deny: {
        await friendsController.denyFriendRequest(req.user.username, req.body.to)
        const response = new SendFriendRequestApi.Responses.FriendRequestDenied()
        response.send(res)
        break
      }
    }
  },
  exceptions: [
    {
      exception: FriendsControllerExceptions.UserNotFound,
      onException: (e, req, res) => {
        res.sendResponse(new SendFriendRequestApi.Errors.UserNotFound())
      },
    },
    {
      exception: FriendsControllerExceptions.FriendRequestAlreadySent,
      onException: (e, req, res) => {
        res.sendResponse(new SendFriendRequestApi.Errors.FriendRequestAlreadySent())
      },
    },
    {
      exception: FriendsControllerExceptions.FriendRequestNotPresent,
      onException: (e, req, res) => {
        res.sendResponse(new SendFriendRequestApi.Errors.FriendRequestNotFound())
      },
    },
  ],
})

export const friendsRouter = Router()
friendsRouter.use(JWTAuthenticationMiddleware)

GetFriendsApiRoute.attachToRouter(friendsRouter)
GetFriendsRequestsApiRoute.attachToRouter(friendsRouter)
SendFriendRequestApiRoute.attachToRouter(friendsRouter)
