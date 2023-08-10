"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRouter = void 0;
const express_1 = require("express");
const message_router_1 = require("./message-router");
const serviceRouter = (0, express_1.Router)();
exports.serviceRouter = serviceRouter;
// Register all routers
serviceRouter.use("", message_router_1.entityRouter);
