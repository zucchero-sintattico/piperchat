import { Router } from 'express'

const healthCheckRouter = Router()

healthCheckRouter.get('/health', (req, res) => {
  res.status(200).send('OK')
})

export { healthCheckRouter }
