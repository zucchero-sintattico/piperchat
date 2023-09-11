import {
  EventLog,
  EventLogEntity,
  ServiceStatus,
  ServiceStatusEntity,
} from '@models/monitoring-model'
import { MonitoringRepository } from './monitoring-repository'

export class MonitoringRepositoryImpl implements MonitoringRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async log(event: any): Promise<void> {
    await EventLogEntity.create({
      topic: event.topic,
      event: event.event,
      payload: event.payload,
    })
  }

  async getLogsOfTopic(topic: string): Promise<EventLog[]> {
    return await EventLogEntity.find({ topic: topic })
      .sort({ timestamp: 1 })
      .limit(1000)
      .exec()
  }

  async getLogsOfTopicAndEvent(topic: string, event: string): Promise<EventLog[]> {
    return await EventLogEntity.find({ topic: topic, event: event })
      .sort({ timestamp: 1 })
      .limit(1000)
      .exec()
  }

  async createServiceStatus(service: string, status: string): Promise<void> {
    await ServiceStatusEntity.create({
      service: service,
      status: status,
    })
  }

  async changeServiceStatus(service: string, status: string): Promise<void> {
    await ServiceStatusEntity.findOneAndUpdate(
      { service: service },
      { status: status },
      { new: true }
    )
  }

  async getServiceStatus(service: string): Promise<ServiceStatus> {
    return await ServiceStatusEntity.findOne({
      service: service,
    }).orFail()
  }

  async getServicesStatus(): Promise<ServiceStatus[]> {
    return await ServiceStatusEntity.find({}).sort({ timestamp: 1 }).limit(1000).exec()
  }

  async cleanServiceStatus(): Promise<void> {
    await ServiceStatusEntity.deleteMany({})
  }
}
