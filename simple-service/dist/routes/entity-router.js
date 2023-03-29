"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityRouter = void 0;
const express_1 = require("express");
const entity_controller_1 = require("../controllers/entity-controller");
const entityController = new entity_controller_1.EntityController();
const entityRouter = (0, express_1.Router)();
exports.entityRouter = entityRouter;
entityRouter
    .route("/")
    .get(entityController.getEntities)
    .post(entityController.createEntity);
entityRouter
    .route("/:id")
    .get(entityController.getEntityById)
    .put(entityController.updateEntity);
