import { Router } from 'express'

const healthCheckRouter = Router()

healthCheckRouter.get('/healthcheck', (req, res) => {
  res.status(200).send('OK')
})
