import { usersRouter } from './routers/user-router'
import { authRouter } from './routers/auth-router'
import { friendsRouter } from './routers/friends-router'
import { profileRouter } from './routers/profile-router'
import { Router } from 'express'
import { whoamiRouter } from './routers/whoami-router'

const serviceRouter = Router()

serviceRouter.use('/auth', authRouter)
serviceRouter.use('/users', usersRouter)
serviceRouter.use('/friends', friendsRouter)
serviceRouter.use('/profile', profileRouter)
serviceRouter.use('/whoami', whoamiRouter)

export { serviceRouter }
