import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthControllerImpl } from '@/controllers/users/auth/auth-controller-impl'
import { UserControllerImpl } from '@/controllers/users/user/user-controller-impl'
import type { AuthController } from '@/controllers/users/auth/auth-controller'
import type { UserController } from '@/controllers/users/user/user-controller'
import { LoginApi } from '@api/users/auth'
import type { WhoamiApi } from '@api/users/user'
import type { FriendsController } from '@/controllers/users/friends/friends-controller'
import { FriendsControllerImpl } from '@/controllers/users/friends/friends-controller-impl'
import type { GetFriendsApi, SendFriendRequestApi, GetFriendsRequestsApi } from '@api/users/friends'

export enum SelectedTab {
  Directs = 'directs',
  Servers = 'servers'
}

export enum ContentArea {
  Empty = 'empty',
  Channel = 'channel',
  Direct = 'direct',
  Multimedie = 'multimedia'
}

export const useUserStore = defineStore(
  'user',
  () => {
    const isLoggedIn = ref(false)
    const username = ref('')
    const email = ref('')
    const description = ref('')
    const photo = ref('')
    const error = ref('')

    // friends username
    const friends = ref<string[]>([])

    // username of pending requests
    const pendingRequests = ref<string[]>([])

    // Display direct or channel in left bar
    const selectedTab = ref(SelectedTab.Directs)
    // Display channel of selected server in left bar
    const selectedServerId = ref('')

    const selectedChannel = ref(['', ''])
    const selectedDirect = ref('')
    const inContentArea = ref(ContentArea.Empty)

    function setActiveChannel(channelId: string) {
      selectedChannel.value[0] = selectedServerId.value
      selectedChannel.value[1] = channelId
    }

    async function whoami() {
      try {
        const response = (await userController.whoami()) as WhoamiApi.Responses.Success
        username.value = response.user.username
        email.value = response.user.email
      } catch (e) {
        console.log(e)
      }
    }

    const authController: AuthController = new AuthControllerImpl()
    const friendsController: FriendsController = new FriendsControllerImpl()
    const userController: UserController = new UserControllerImpl()

    // ==================== AUTH ==================== //
    async function login(
      parameters: { username: string; password: string },
      onSuccess: () => void,
      onError: (error: any) => void
    ) {
      try {
        const response: LoginApi.Response = await authController.login({
          username: parameters.username,
          password: parameters.password
        })
        switch (response.statusCode) {
          case 200:
            isLoggedIn.value = true
            onSuccess()
            await whoami()
            break
          case 401:
            onError('Wrong Username or Password')
            break
          default:
            onError('Error')
            break
        }
      } catch (e) {
        onError(e)
      }
    }
    async function register(
      parameters: { username: string; email: string; password: string },
      onSuccess: () => void,
      onError: (error: any) => void
    ) {
      try {
        const response = await authController.register({
          username: parameters.username,
          email: parameters.email,
          password: parameters.password
        })
        switch (response.statusCode) {
          case 200:
            onSuccess()
            break
          case 409:
            onError('User already exists')
            break
          default:
            onError('Error')
            break
        }
      } catch (e) {
        onError(e)
      }
    }

    async function logout() {
      try {
        await authController.logout()
        isLoggedIn.value = false
      } catch (e) {
        console.log(e)
        error.value = 'Errore nel logout'
      }
    }

    // ==================== FRIENDS ==================== //
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
      isLoggedIn,
      username,
      email,
      description,
      photo,
      error,
      selectedServerId,
      selectedTab,
      selectedChannel,
      selectedDirect,
      inContentArea,
      friends,
      pendingRequests,
      setActiveChannel,
      login,
      register,
      logout,
      fetchFriends,
      sendFriendRequest,
      fetchFriendRequest,
      acceptFriendRequest,
      denyFriendRequest
    }
  },
  { persist: true }
)
