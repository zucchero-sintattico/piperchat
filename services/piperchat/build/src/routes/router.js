"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRouter = void 0;
const express_1 = require("express");
const server_router_1 = require("./routers/server-router");
const message_channel_router_1 = require("./routers/message-channel-router");
const multimedia_channel_router_1 = require("./routers/multimedia-channel-router");
const jwt_1 = require("@piperchat/commons/src/jwt");
const serviceRouter = (0, express_1.Router)();
exports.serviceRouter = serviceRouter;
serviceRouter.use(jwt_1.JWTAuthenticationMiddleware);
// Register all routers
serviceRouter.use("/server", server_router_1.serverRouter);
serviceRouter.use("/message-channel", message_channel_router_1.messageChannelRouter);
serviceRouter.use("/multimedia-channel", multimedia_channel_router_1.multimediaChannelRouter);
