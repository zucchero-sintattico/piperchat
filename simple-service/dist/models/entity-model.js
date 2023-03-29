"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const mongoose_1 = require("mongoose");
const EntitySchema = new mongoose_1.Schema({
    name: String,
    description: String,
    createdAt: Date,
    updatedAt: Date,
});
const Entity = (0, mongoose_1.model)("Entity", EntitySchema);
exports.Entity = Entity;
