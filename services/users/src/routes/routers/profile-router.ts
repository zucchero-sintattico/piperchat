import { Request, Response, Router } from 'express'
import { JWTAuthenticationMiddleware } from '@piperchat/commons'
import { ProfileControllerImpl } from '@controllers/profile/profile-controller-impl'
import { ProfileController } from '@controllers/profile/profile-controller'

const profileController: ProfileController = new ProfileControllerImpl()

export const profileRouter = Router()
profileRouter.use(JWTAuthenticationMiddleware)

profileRouter.put('/photo', async (req: Request, res: Response) => {
  if (!req.body.photo) {
    return res.status(400).json({ message: "Missing 'photo' in body" })
  }
  try {
    await profileController.updateUserPhoto(req.user.username, req.body.photo)
    return res.status(200).json({ message: 'Photo set' })
  } catch (e) {
    return res.status(400).json({ message: 'Bad request', error: e })
  }
})

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
