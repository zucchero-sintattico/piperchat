"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageChannelRouter = void 0;
const express_1 = require("express");
const message_channel_controller_impl_1 = require("../../controllers/message-channel/message-channel-controller-impl");
exports.messageChannelRouter = (0, express_1.Router)();
const messageChannelController = new message_channel_controller_impl_1.MessageChannelControllerImpl();
exports.messageChannelRouter
    .route("/create")
    .post(async (req, res) => {
    if (!req.body.serverId || !req.body.name) {
        res.status(400).json({ error: "Missing serverId or name" });
        return;
    }
    messageChannelController
        .createMessageChannel(req.body.serverId, req.body.name)
        .then((messageChannel) => {
        res.status(200).json(messageChannel);
    })
        .catch((err) => {
        res.status(400).json(err);
    });
});
exports.messageChannelRouter
    .route("/update")
    .post(async (req, res) => {
    if (!req.body.id) {
        res.status(400).json({ error: "Missing id" });
        return;
    }
    messageChannelController
        .updateMessageChannel(req.body.id, req.body.name)
        .then((messageChannel) => {
        res.status(200).json(messageChannel);
    })
        .catch((err) => {
        res.status(400).json(err);
    });
});
exports.messageChannelRouter
    .route("/delete")
    .post(async (req, res) => {
    if (!req.body.id) {
        res.status(400).json({ error: "Missing id" });
        return;
    }
    messageChannelController
        .deleteMessageChannel(req.body.id)
        .then((messageChannel) => {
        res.status(200).json(messageChannel);
    })
        .catch((err) => {
        res.status(400).json(err);
    });
});
