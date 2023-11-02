import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { GetUserStatusApi } from '@api/users/user'
import {
  NotificationControllerImpl,
  type NotificationController
} from '@/controllers/notifications/notifications-controller'

export type UserStatus = GetUserStatusApi.Responses.UserStatusInfo
export const useUsersStatusStore = defineStore('users-status', () => {
  const notificationController: NotificationController = new NotificationControllerImpl()

  const usersStatus = ref<Record<string, UserStatus | undefined>>({})

  async function reloadUserStatus(user: string) {
    const statusResponse = await notificationController.getUserStatus(user)
    if (statusResponse.statusCode === 200) {
      const typedStatus = (statusResponse as GetUserStatusApi.Responses.Success).status
      usersStatus.value[user] = typedStatus
    } else {
      console.error(statusResponse)
    }
  }

  function getUserStatus(user: string): Ref<UserStatus | undefined> {
    if (!usersStatus.value[user]) {
      reloadUserStatus(user)
    }
    return computed(() => usersStatus.value[user])
  }

  return {
    reloadUserStatus,
    getUserStatus
  }
})
