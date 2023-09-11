import { Request, Response, Router } from 'express'
import { JWTAuthenticationMiddleware } from '@commons/jwt'
import { ProfileControllerImpl } from '@controllers/profile/profile-controller-impl'
import { ProfileController } from '@controllers/profile/profile-controller'

// Import specific interfaces from the API
import { InternalServerError } from '@api//errors'
import { Validate } from '@api/validate'
import { UpdatePhotoApi, UpdateDescriptionApi } from '@api/users/profile'

const profileController: ProfileController = new ProfileControllerImpl()

export const profileRouter = Router()
profileRouter.use(JWTAuthenticationMiddleware)

profileRouter.put(
  '/photo',
  Validate(UpdatePhotoApi.Request.Schema),
  async (
    req: Request<
      UpdatePhotoApi.Request.Params,
      UpdatePhotoApi.Response,
      UpdatePhotoApi.Request.Body
    >,
    res: Response<UpdatePhotoApi.Response | InternalServerError>
  ) => {
    try {
      await profileController.updateUserPhoto(req.user.username, req.body.photo)
      const response = new UpdatePhotoApi.Responses.Success()
      response.send(res)
    } catch (e) {
      const response = new InternalServerError(e)
      response.send(res)
    }
  }
)

profileRouter.put(
  '/description',
  Validate(UpdateDescriptionApi.Request.Schema),
  async (
    req: Request<
      UpdateDescriptionApi.Request.Params,
      UpdateDescriptionApi.Response,
      UpdateDescriptionApi.Request.Body
    >,
    res: Response<UpdateDescriptionApi.Response | InternalServerError>
  ) => {
    try {
      await profileController.updateUserDescription(
        req.user.username,
        req.body.description
      )
      const response = new UpdateDescriptionApi.Responses.Success()
      response.send(res)
    } catch (e) {
      const response = new InternalServerError(e)
      response.send(res)
    }
  }
)
