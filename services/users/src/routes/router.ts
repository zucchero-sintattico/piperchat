import { Router } from 'express'
import { usersRouter } from './routers/user-router'
import { authRouter } from './routers/auth-router'
import { friendsRouter } from './routers/friends-router'
import { profileRouter } from './routers/profile-router'
import { healthCheckRouter } from '@piperchat/commons'

const serviceRouter = Router()

serviceRouter.use('/auth', authRouter)
serviceRouter.use('/users', usersRouter)
serviceRouter.use('/friends', friendsRouter)
serviceRouter.use('/profile', profileRouter)
serviceRouter.use('/healthcheck', healthCheckRouter)

export { serviceRouter }
