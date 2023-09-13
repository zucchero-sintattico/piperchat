import { Request, Response, Router } from 'express'
import { MonitoringController } from '@/controllers/monitoring-controller'
import { MonitoringControllerImpl } from '@/controllers/monitoring-controller-impl'

import { Validate } from '@api/validate'
import { InternalServerError } from '@api/errors'
import { GetServicesStatusApi } from '@api/monitoring/status'

const monitoringRouter: Router = Router({
  strict: true,
  mergeParams: true,
})
const monitoringController: MonitoringController = new MonitoringControllerImpl()

monitoringRouter.get(
  '/',
  Validate(GetServicesStatusApi.Request.Schema),
  async (
    req: Request<
      GetServicesStatusApi.Request.Params,
      GetServicesStatusApi.Response,
      GetServicesStatusApi.Request.Body
    >,
    res: Response<GetServicesStatusApi.Response | InternalServerError>
  ) => {
    try {
      const monitoring = await monitoringController.getServiceStatus()
      const response = new GetServicesStatusApi.Responses.Success(monitoring)
      response.send(res)
    } catch (e) {
      const response = new InternalServerError(e)
      response.send(res)
    }
  }
)

export { monitoringRouter }
