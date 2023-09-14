import { ProfileControllerImpl } from '@controllers/profile/profile-controller-impl'
import { ProfileController } from '@controllers/profile/profile-controller'
import { UpdatePhotoApi, UpdateDescriptionApi } from '@api/users/profile'
import { ApiRouter, Route } from '@commons/router'

const profileController: ProfileController = new ProfileControllerImpl()

const profileApiRouter = new ApiRouter()
export const profileRouter = profileApiRouter.getRouter()

export const UpdatePhotoApiRoute = new Route<
  UpdatePhotoApi.Response,
  UpdatePhotoApi.Request.Params,
  UpdatePhotoApi.Request.Body
>({
  method: 'put',
  path: '/photo',
  schema: UpdatePhotoApi.Request.Schema,
  handler: async (req, res) => {
    await profileController.updateUserPhoto(req.user.username, req.body.photo)
    const response = new UpdatePhotoApi.Responses.Success()
    res.sendResponse(response)
  },
})

export const UpdateDescriptionApiRoute = new Route<
  UpdateDescriptionApi.Response,
  UpdateDescriptionApi.Request.Params,
  UpdateDescriptionApi.Request.Body
>({
  method: 'put',
  path: '/description',
  schema: UpdateDescriptionApi.Request.Schema,
  handler: async (req, res) => {
    await profileController.updateUserDescription(req.user.username, req.body.description)
    const response = new UpdateDescriptionApi.Responses.Success()
    res.sendResponse(response)
  },
})
