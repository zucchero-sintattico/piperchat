"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRouter = void 0;
const express_1 = require("express");
const infra_service_middleware_1 = require("@piperchat/commons/src/infra-service-middleware");
const sessionRouter_1 = require("./routers/sessionRouter");
exports.serviceRouter = (0, express_1.Router)();
exports.serviceRouter.use(infra_service_middleware_1.infraServiceMiddleware);
exports.serviceRouter.use("/session", sessionRouter_1.sessionRouter);
