import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FriendsController } from '@/controllers/users/friends/friends-controller'
import { FriendsControllerImpl } from '@/controllers/users/friends/friends-controller-impl'
import type { GetFriendsApi, SendFriendRequestApi, GetFriendsRequestsApi } from '@api/users/friends'

export const useFriendStore = defineStore(
  'friends',
  () => {
    const friends = ref<string[]>([])
    const pendingRequests = ref<string[]>([])

    const friendsController: FriendsController = new FriendsControllerImpl()

    async function fetchFriends() {
      try {
        const response = (await friendsController.getFriends()) as GetFriendsApi.Response
        if (response.statusCode === 200) {
          const typed = response as GetFriendsApi.Responses.Success
          friends.value = typed.friends
        } else {
          console.log(response)
        }
      } catch (e) {
        console.log(e)
      }
    }

    async function sendFriendRequest(
      username: string,
      onSuccess: () => void,
      onError: (error: any) => void
    ) {
      try {
        const response = await friendsController.sendFriendRequest(username)
        if (response.statusCode === 200) {
          onSuccess()
        } else {
          const typed = response as SendFriendRequestApi.Errors.Type
          onError(typed.error)
        }
      } catch (e) {
        console.log(e)
      }
    }

    async function fetchFriendRequest() {
      try {
        const response = await friendsController.getFriendsRequests()
        if (response.statusCode === 200) {
          const typed = response as GetFriendsRequestsApi.Responses.Success
          pendingRequests.value = typed.requests
        } else {
          console.log(response)
        }
      } catch (e) {
        console.log(e)
      }
    }

    async function acceptFriendRequest(
      username: string,
      onSuccess: () => void,
      onError: (error: any) => void
    ) {
      try {
        const response = await friendsController.acceptFriendRequest(username)
        if (response.statusCode === 200) {
          pendingRequests.value = pendingRequests.value.filter((value) => value !== username)
          friends.value.push(username)
          onSuccess()
        } else {
          const typed = response as SendFriendRequestApi.Errors.Type
          onError(typed.error)
        }
      } catch (e) {
        console.log(e)
      }
    }

    async function denyFriendRequest(
      username: string,
      onSuccess: () => void,
      onError: (error: any) => void
    ) {
      try {
        const response = await friendsController.denyFriendRequest(username)
        if (response.statusCode === 200) {
          pendingRequests.value = pendingRequests.value.filter((value) => value !== username)
          onSuccess()
        } else {
          const typed = response as SendFriendRequestApi.Errors.Type
          onError(typed.error)
        }
      } catch (e) {
        console.log(e)
      }
    }

    return {
      friends,
      pendingRequests,
      fetchFriends,
      sendFriendRequest,
      fetchFriendRequest,
      acceptFriendRequest,
      denyFriendRequest
    }
  },
  { persist: true }
)
