"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityRouter = void 0;
const express_1 = require("express");
const monitoring_controller_1 = require("../controllers/monitoring-controller");
const entityController = new monitoring_controller_1.EntityController();
/**
 * The router of a generic entity.
 */
const entityRouter = (0, express_1.Router)();
exports.entityRouter = entityRouter;
entityRouter
    .route("/")
    .get(entityController.getEntities.bind(entityController))
    .post(entityController.createEntity.bind(entityController));
entityRouter
    .route("/:id")
    .get(entityController.getEntityById.bind(entityController))
    .put(entityController.updateEntity.bind(entityController))
    .delete(entityController.deleteEntity.bind(entityController));
