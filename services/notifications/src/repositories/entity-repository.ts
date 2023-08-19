import { NotificationEntity } from '@models/notification-model'

/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export class EntityRepository {
  async getEntities() {
    return await NotificationEntity.find()
  }

  async getEntityById(id: string) {
    return await NotificationEntity.findById(id)
  }

  async createEntity(entity: any) {
    const newEntity = new NotificationEntity(entity)
    await newEntity.save()
    return newEntity
  }

  async updateEntity(id: string, entity: any) {
    return await NotificationEntity.findByIdAndUpdate(id, entity, {
      new: true,
    })
  }

  async deleteEntity(id: string) {
    return await NotificationEntity.findByIdAndDelete(id)
  }
}
