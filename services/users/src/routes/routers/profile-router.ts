import { Request, Response, Router } from 'express'
import { Api, JWTAuthenticationMiddleware } from '@piperchat/commons'
import { ProfileControllerImpl } from '@controllers/profile/profile-controller-impl'
import { ProfileController } from '@controllers/profile/profile-controller'

// Import specific interfaces from the API
import ApiErrors = Api.Errors
import UpdatePhotoApi = Api.Users.Profile.UpdatePhoto

const profileController: ProfileController = new ProfileControllerImpl()

export const profileRouter = Router()
profileRouter.use(JWTAuthenticationMiddleware)

profileRouter.put(
  '/photo',
  async (
    req: Request<
      UpdatePhotoApi.Request.Params,
      UpdatePhotoApi.Response,
      UpdatePhotoApi.Request.Body,
      UpdatePhotoApi.Request.Query
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

profileRouter.put('/description', async (req: Request, res: Response) => {
  if (!req.body.description) {
    return res.status(400).json({ message: "Missing 'description' in body" })
  }
  try {
    await profileController.updateUserDescription(req.user.username, req.body.description)
    return res.status(200).json({ message: 'Description set' })
  } catch (e) {
    return res.status(404).json({ message: 'Bad request', error: e })
  }
})
