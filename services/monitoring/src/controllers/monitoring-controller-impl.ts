import { EventLog, ServiceStatus } from '@models/monitoring-model'
import { MonitoringRepository } from '@repositories/monitoring-repository'
import { MonitoringRepositoryImpl } from '@repositories/monitoring-repository-impl'
import { MonitoringController } from './monitoring-controller'

export class MonitoringControllerImpl implements MonitoringController {
  private monitoringRepository: MonitoringRepository = new MonitoringRepositoryImpl()

  // TODO: Implements verification of user authorization
  async getLogsOfTopic(topic: string): Promise<EventLog[]> {
    return await this.monitoringRepository.getLogsOfTopic(topic)
  }

  async getLogsOfTopicAndEvent(topic: string, event: string): Promise<EventLog[]> {
    return await this.monitoringRepository.getLogsOfTopicAndEvent(topic, event)
  }

  async getServiceStatus(): Promise<ServiceStatus[]> {
    return await this.monitoringRepository.getServicesStatus()
  }

  async getServiceStatusByServiceName(serviceName: string): Promise<ServiceStatus> {
    return await this.monitoringRepository.getServiceStatus(serviceName)
  }
}
