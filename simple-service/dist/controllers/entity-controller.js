"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityController = void 0;
const entity_model_1 = require("../models/entity-model");
const entity_events_1 = require("../events/entity-events");
class EntityController {
    getEntities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const entities = yield entity_model_1.Entity.find();
            res.json(entities);
        });
    }
    getEntityById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield entity_model_1.Entity.findById(req.params.id);
            res.json(entity);
        });
    }
    createEntity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = new entity_model_1.Entity(req.body);
            yield entity.save();
            res.json(entity);
            entity_events_1.EntityEvents.publishEntityCreated(entity);
        });
    }
    updateEntity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield entity_model_1.Entity.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            res.json(updated);
            entity_events_1.EntityEvents.publishEntityUpdated(updated);
        });
    }
}
exports.EntityController = EntityController;
