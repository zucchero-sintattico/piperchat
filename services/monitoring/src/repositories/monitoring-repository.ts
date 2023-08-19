import { MessageMonitorEntity, UserMonitorEntity } from '@models/monitoring-model'

/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export class MonitoringRepository {
  async createUserEvent(user: any) {
    await UserMonitorEntity.create(user)
  }
  async createMessageEvent(message: any) {
    await MessageMonitorEntity.create(message)
  }
}
