import { Router } from 'express'
import { MonitoringController } from '@/controllers/monitoring-controller'
import { MonitoringControllerImpl } from '@/controllers/monitoring-controller-impl'

const monitoringRouter: Router = Router()
const monitoringController: MonitoringController = new MonitoringControllerImpl()

monitoringRouter.get('/', async (req, res) => {
  try {
    const monitoring = await monitoringController.getServiceStatus()
    res.status(200).json(monitoring)
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error', error: e })
  }
})

export { monitoringRouter }
