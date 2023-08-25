import { Router } from 'express'

const healthCheckRouter = Router()

healthCheckRouter.get('/', (req, res) => {
  res.status(200).send('OK')
})

export { healthCheckRouter }
