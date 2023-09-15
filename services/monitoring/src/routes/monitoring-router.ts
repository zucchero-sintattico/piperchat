import { MonitoringController } from '@/controllers/monitoring-controller'
import { MonitoringControllerImpl } from '@/controllers/monitoring-controller-impl'
import { GetServicesStatusApi } from '@api/monitoring/status'
import { Route } from '@commons/router'
import { Router } from 'express'

const monitoringController: MonitoringController = new MonitoringControllerImpl()

const MonitoringApiRoute = new Route<GetServicesStatusApi.Response>({
  method: 'get',
  path: '/',
  schema: GetServicesStatusApi.Request.Schema,
  handler: async (req, res) => {
    const monitoring = await monitoringController.getServiceStatus()
    const response = new GetServicesStatusApi.Responses.Success(monitoring)
    res.sendResponse(response)
  },
})

export const monitoringRouter = Router()
MonitoringApiRoute.attachToRouter(monitoringRouter)
