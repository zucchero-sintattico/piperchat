import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import type { UserController } from '@/controllers/users/user/user-controller'
import { UserControllerImpl } from '@/controllers/users/user/user-controller-impl'
import type { GetUserPhotoApi } from '@api/users/user'

export const usePhotoStore = defineStore('photo', () => {
  const userController: UserController = new UserControllerImpl()
  const usersPhotos = ref<Record<string, string | undefined>>({})

  async function reloadUserPhoto(targetUsername: string) {
    try {
      const response = await userController.getUserPhoto({
        username: targetUsername
      })
      if (response.statusCode === 200) {
        const typed = response as GetUserPhotoApi.Responses.Success
        if (typed.photo.data !== undefined) {
          usersPhotos.value[targetUsername] =
            'data:image/jpeg;base64,' +
            btoa(
              new Uint8Array((typed.photo.data as any).data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  function getUserPhoto(targetUsername: string): Ref<string | undefined> {
    if (usersPhotos.value[targetUsername] === undefined) {
      reloadUserPhoto(targetUsername)
    }
    return computed(() => usersPhotos.value[targetUsername])
  }

  return {
    reloadUserPhoto,
    getUserPhoto
  }
})
