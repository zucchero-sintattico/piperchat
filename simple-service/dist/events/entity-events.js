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
exports.EntityEvents = void 0;
const rabbit_mq_1 = require("../utils/rabbit-mq");
class EntityEvents {
    static getInstance() {
        if (!this._instance) {
            this._instance = rabbit_mq_1.RabbitMQ.getInstance();
        }
        return this._instance;
    }
    static getChannel() {
        return this.getInstance().getChannel();
    }
    static publishEntityCreated(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = this.getChannel();
            if (channel) {
                channel.publish("entity", "entity.created", Buffer.from(JSON.stringify(entity)));
            }
        });
    }
    static publishEntityUpdated(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = this.getChannel();
            if (channel) {
                channel.publish("entity", "entity.updated", Buffer.from(JSON.stringify(entity)));
            }
        });
    }
}
exports.EntityEvents = EntityEvents;
