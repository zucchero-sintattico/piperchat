import { Request, Response, Router } from 'express'
import { MonitoringController } from '@/controllers/monitoring-controller'
import { MonitoringControllerImpl } from '@/controllers/monitoring-controller-impl'

import { Validate } from '@piperchat/api/src/validate'
import { InternalServerError } from '@piperchat/api/src/errors'
import { GetServicesStatusApi } from '@piperchat/api/src/monitoring/status'

const monitoringRouter: Router = Router()
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
