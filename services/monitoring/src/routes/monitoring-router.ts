import { MonitoringController } from '@/controllers/monitoring-controller'
import { MonitoringControllerImpl } from '@/controllers/monitoring-controller-impl'

import { InternalServerError } from '@api/errors'
import { GetServicesStatusApi } from '@api/monitoring/status'
import { LoginApi } from '@api/users/auth'
import { ApiRouter } from '@commons/router'

const monitoringRouter: ApiRouter = new ApiRouter()

const monitoringController: MonitoringController = new MonitoringControllerImpl()

monitoringRouter.get<LoginApi.Request.Params, LoginApi.Request.Body, LoginApi.Response>(
  '/',
  LoginApi.Request.Schema,
  async (req, res) => {
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
