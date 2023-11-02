import { GetServicesStatusApi } from '@api/monitoring/status'
import { AxiosController } from '../axios-controller'
export interface MonitoringController {
  getServicesStatus(): Promise<GetServicesStatusApi.Response>
}

export class MonitoringControllerImpl extends AxiosController implements MonitoringController {
  async getServicesStatus(): Promise<GetServicesStatusApi.Response> {
    return this.get<GetServicesStatusApi.Response>('/status')
  }
}
