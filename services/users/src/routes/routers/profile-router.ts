import { Request, Response, Router } from 'express'
import { JWTAuthenticationMiddleware } from '@piperchat/commons'
import { ProfileControllerImpl } from '@controllers/profile/profile-controller-impl'
import { ProfileController } from '@controllers/profile/profile-controller'

// Import specific interfaces from the API
import * as Api from '@piperchat/commons/src/api/index'
import ApiErrors = Api.Errors
import UpdatePhotoApi = Api.Users.Profile.UpdatePhoto
import UpdateDescriptionApi = Api.Users.Profile.UpdateDescription

const profileController: ProfileController = new ProfileControllerImpl()

export const profileRouter = Router()
profileRouter.use(JWTAuthenticationMiddleware)

profileRouter.put(
  '/photo',
  Api.Validate(UpdatePhotoApi.Request.Schema),
  async (
    req: Request<
      UpdatePhotoApi.Request.Params,
      UpdatePhotoApi.Response,
      UpdatePhotoApi.Request.Body
    >,
    res: Response<UpdatePhotoApi.Response | ApiErrors.InternalServerError>
  ) => {
    try {
      await profileController.updateUserPhoto(req.user.username, req.body.photo)
      const response = new UpdatePhotoApi.Responses.Success()
      response.send(res)
    } catch (e) {
      const response = new ApiErrors.InternalServerError(e)
      response.send(res)
    }
  }
)

profileRouter.put(
  '/description',
  Api.Validate(UpdateDescriptionApi.Request.Schema),
  async (
    req: Request<
      UpdateDescriptionApi.Request.Params,
      UpdateDescriptionApi.Response,
      UpdateDescriptionApi.Request.Body
    >,
    res: Response<UpdateDescriptionApi.Response | ApiErrors.InternalServerError>
  ) => {
    try {
      await profileController.updateUserDescription(
        req.user.username,
        req.body.description
      )
      const response = new UpdateDescriptionApi.Responses.Success()
      response.send(res)
    } catch (e) {
      const response = new ApiErrors.InternalServerError(e)
      response.send(res)
    }
  }
)
