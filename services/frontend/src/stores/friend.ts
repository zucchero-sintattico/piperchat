import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FriendsController } from '@/controllers/users/friends/friends-controller'
import { FriendsControllerImpl } from '@/controllers/users/friends/friends-controller-impl'
import type { GetFriendsApi, SendFriendRequestApi, GetFriendsRequestsApi } from '@api/users/friends'

export const useFriendStore = defineStore(
  'friends',
  () => {
    const friendsController: FriendsController = new FriendsControllerImpl()

    const friends = ref<string[]>([])
    const pendingRequests = ref<string[]>([])

    let refreshing = false
    async function refresh() {
      if (refreshing) {
        return
      }
      refreshing = true
      console.log('Refreshing friends')
      await refreshFriends()
      await refreshFriendRequests()
      refreshing = false
    }

    // ================ Fetching ================ //
    async function refreshFriends() {
      try {
        const response = (await friendsController.getFriends()) as GetFriendsApi.Response
        if (response.statusCode === 200) {
          const typed = response as GetFriendsApi.Responses.Success
          friends.value = typed.friends
        } else {
          console.error(response)
        }
      } catch (e) {
        console.error(e)
      }
    }

    async function refreshFriendRequests() {
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

    // ================ Request ================ //
    async function sendFriendRequest(username: string) {
      const response = await friendsController.sendFriendRequest(username)
      if (response.statusCode !== 200) {
        const typed = response as SendFriendRequestApi.Errors.Type
        throw new Error(typed.error)
      }
    }

    async function acceptFriendRequest(username: string) {
      const response = await friendsController.acceptFriendRequest(username)
      if (response.statusCode === 200) {
        await refresh()
      } else {
        const typed = response as SendFriendRequestApi.Errors.Type
        throw new Error(typed.error)
      }
    }

    async function denyFriendRequest(username: string) {
      const response = await friendsController.denyFriendRequest(username)
      if (response.statusCode === 200) {
        await refresh()
      } else {
        const typed = response as SendFriendRequestApi.Errors.Type
        throw new Error(typed.error)
      }
    }

    return {
      // ================ Data ================ //
      friends,
      pendingRequests,
      // ================ Fetching ================ //
      refresh,
      // ================ Request ================ //
      sendFriendRequest,
      acceptFriendRequest,
      denyFriendRequest
    }
  },
  { persist: true }
)
