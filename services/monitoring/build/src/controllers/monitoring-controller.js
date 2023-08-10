"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityController = void 0;
const _monitoring_events_repository_1 = require("../events/repositories/ monitoring-events-repository");
const monitoring_repository_1 = require("../repositories/monitoring-repository");
/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
class EntityController {
    // The repository is a private property of the controller.
    entityRepository = new monitoring_repository_1.MonitoringRepository();
    // The events repository is a private property of the controller.
    entityEventsRepository = new _monitoring_events_repository_1.MessageEventsRepository();
    async getEntities(req, res) {
        /* const entities = await this.entityRepository.getEntities();
        res.json(entities); */
    }
    async getEntityById(req, res) {
        /* const entity = await this.entityRepository.getEntityById(req.params.id);
        res.json(entity); */
    }
    async createEntity(req, res) {
        /* const entity = await this.entityRepository.createEntity(req.body);
        res.json(entity);
        this.entityEventsRepository.publishEntityCreated(entity); */
    }
    async updateEntity(req, res) {
        /* const entity = await this.entityRepository.updateEntity(
            req.params.id,
            req.body
        );
        res.json(entity);
        this.entityEventsRepository.publishEntityUpdated(entity); */
    }
    async deleteEntity(req, res) {
        /* const entity = await this.entityRepository.deleteEntity(req.params.id);
        res.json(entity);
        this.entityEventsRepository.publishEntityDeleted(entity); */
    }
}
exports.EntityController = EntityController;
