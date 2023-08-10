"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringRepository = void 0;
const monitoring_model_1 = require("../models/monitoring-model");
/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
class MonitoringRepository {
    async createUserEvent(user) {
        await monitoring_model_1.UserMonitorEntity.create(user);
    }
    async createMessageEvent(message) {
        await monitoring_model_1.MessageMonitorEntity.create(message);
    }
}
exports.MonitoringRepository = MonitoringRepository;
