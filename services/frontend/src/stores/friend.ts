import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FriendsController } from '@/controllers/users/friends/friends-controller'
import { FriendsControllerImpl } from '@/controllers/users/friends/friends-controller-impl'
import type { GetFriendsApi, SendFriendRequestApi, GetFriendsRequestsApi } from '@api/users/friends'
import type { NotificationController } from '@/controllers/notifications/notifications-controller'
import { NotificationControllerImpl } from '@/controllers/notifications/notifications-controller'
import { GetUserStatusApi } from '@api/users/user'

interface Friend {
  username: string
  status: GetUserStatusApi.Responses.UserStatusInfo
}

export const useFriendStore = defineStore(
  'friends',
  () => {
    const friends = ref<Friend[]>([])

    const pendingRequests = ref<string[]>([])

    const friendsController: FriendsController = new FriendsControllerImpl()
    const notificationController: NotificationController = new NotificationControllerImpl()

    function removeRequestOf(username: string) {
      pendingRequests.value = pendingRequests.value.filter((value) => value !== username)
    }

    // ================ Fetching ================ //
    let refreshing = false
    async function refreshFriends() {
      if (refreshing) {
        return
      }
      refreshing = true
      try {
        const response = (await friendsController.getFriends()) as GetFriendsApi.Response
        if (response.statusCode === 200) {
          friends.value = []
          const typed = response as GetFriendsApi.Responses.Success
          for (const friend of typed.friends) {
            const statusResponse = await notificationController.getUserStatus(friend)
            if (statusResponse.statusCode === 200) {
              const typedStatus = await fetchUserStatus(friend)
              friends.value.push({ username: friend, status: typedStatus.status })
            } else {
              console.error(statusResponse)
            }
          }
        } else {
          console.error(response)
        }
      } catch (e) {
        console.error(e)
      } finally {
        refreshing = false
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

    async function fetchUserStatus(username: string): Promise<GetUserStatusApi.Responses.Success> {
      const response = await notificationController.getUserStatus(username)
      if (response.statusCode === 200) {
        return response as GetUserStatusApi.Responses.Success
      } else {
        throw new Error('Error fetching user status for ' + username)
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
        removeRequestOf(username)
        const status = await fetchUserStatus(username)
        friends.value.push({ username, status: status.status })
      } else {
        const typed = response as SendFriendRequestApi.Errors.Type
        throw new Error(typed.error)
      }
    }

    async function denyFriendRequest(username: string) {
      const response = await friendsController.denyFriendRequest(username)
      if (response.statusCode === 200) {
        removeRequestOf(username)
      } else {
        const typed = response as SendFriendRequestApi.Errors.Type
        throw new Error(typed.error)
      }
    }

    return {
      friends,
      pendingRequests,
      refreshFriends,
      sendFriendRequest,
      fetchFriendRequest,
      acceptFriendRequest,
      denyFriendRequest
    }
  },
  { persist: true }
)
