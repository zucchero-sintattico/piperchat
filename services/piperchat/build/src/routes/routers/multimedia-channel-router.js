"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multimediaChannelRouter = void 0;
const express_1 = require("express");
const message_channel_controller_impl_1 = require("../../controllers/message-channel/message-channel-controller-impl");
exports.multimediaChannelRouter = (0, express_1.Router)();
const multimediaChannelController = new message_channel_controller_impl_1.MessageChannelControllerImpl();
exports.multimediaChannelRouter.post("/create", async (req, res) => {
    if (!req.body.serverId) {
        res.status(400).send("serverId not provided");
        return;
    }
    if (!req.body.name) {
        res.status(400).send("name not provided");
        return;
    }
    multimediaChannelController
        .createMessageChannel(req.body.serverId, req.body.name)
        .then((messageChannel) => {
        res.status(200).send(messageChannel);
    })
        .catch((err) => {
        res.status(400).send(err);
    });
});
exports.multimediaChannelRouter.post("/update", async (req, res) => {
    if (!req.body.id) {
        res.status(400).send("id not provided");
        return;
    }
    multimediaChannelController
        .updateMessageChannel(req.body.id, req.body.name)
        .then((messageChannel) => {
        res.status(200).send(messageChannel);
    })
        .catch((err) => {
        res.status(400).send(err);
    });
});
exports.multimediaChannelRouter.post("/delete", async (req, res) => {
    if (!req.body.id) {
        res.status(400).send("id not provided");
        return;
    }
    multimediaChannelController
        .deleteMessageChannel(req.body.id)
        .then((messageChannel) => {
        res.status(200).send(messageChannel);
    })
        .catch((err) => {
        res.status(400).send(err);
    });
});
