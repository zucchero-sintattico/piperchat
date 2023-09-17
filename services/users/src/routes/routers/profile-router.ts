import { ProfileControllerImpl } from '@controllers/profile/profile-controller-impl'
import { ProfileController } from '@controllers/profile/profile-controller'
import { UpdatePhotoApi, UpdateDescriptionApi } from '@api/users/profile'
import { Route } from '@commons/route'
import { Router } from 'express'
import { JWTAuthenticationMiddleware } from '@commons/utils/jwt'
import multer from 'multer'
import fs from 'fs'
import { EmptySchema } from '@api/schema'

const profileController: ProfileController = new ProfileControllerImpl()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/app/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  },
})
const upload = multer({ storage: storage })

export const UpdatePhotoApiRoute = new Route<
  UpdatePhotoApi.Response,
  UpdatePhotoApi.Request.Params,
  UpdatePhotoApi.Request.Body
>({
  method: 'put',
  path: '/photo',
  schema: EmptySchema,
  middlewares: [upload.single('photo')],
  handler: async (req, res) => {
    if (!req.file) {
      const response = new UpdatePhotoApi.Errors.InvalidPhoto()
      res.sendResponse(response)
      return
    }
    const photo = {
      data: fs.readFileSync('/app/uploads/' + req.file.filename),
      contentType: req.file!.mimetype,
    }
    await profileController.updateUserPhoto(req.user.username, photo)
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

export const profileRouter = Router()
profileRouter.use(JWTAuthenticationMiddleware)

UpdatePhotoApiRoute.attachToRouter(profileRouter)
UpdateDescriptionApiRoute.attachToRouter(profileRouter)
