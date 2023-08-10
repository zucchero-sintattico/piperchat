"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRepository = void 0;
const notification_model_1 = require("../models/notification-model");
/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
class EntityRepository {
    async getEntities() {
        return await notification_model_1.NotificationEntity.find();
    }
    async getEntityById(id) {
        return await notification_model_1.NotificationEntity.findById(id);
    }
    async createEntity(entity) {
        const newEntity = new notification_model_1.NotificationEntity(entity);
        await newEntity.save();
        return newEntity;
    }
    async updateEntity(id, entity) {
        return await notification_model_1.NotificationEntity.findByIdAndUpdate(id, entity, {
            new: true,
        });
    }
    async deleteEntity(id) {
        return await notification_model_1.NotificationEntity.findByIdAndDelete(id);
    }
}
exports.EntityRepository = EntityRepository;
