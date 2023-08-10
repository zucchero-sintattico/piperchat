"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRouter = void 0;
const express_1 = require("express");
const session_controller_1 = require("../../controllers/session/session-controller");
const session_controller_impl_1 = require("../../controllers/session/session-controller-impl");
exports.sessionRouter = (0, express_1.Router)();
const sessionController = new session_controller_impl_1.SessionControllerImpl();
exports.sessionRouter.post("/", async (req, res) => {
    if (!req.body.allowedUsers ||
        !Array.isArray(req.body.allowedUsers) ||
        req.body.allowedUsers.length === 0) {
        res.status(400).send("Bad request, allowedUsers must be a non-empty array");
        return;
    }
    try {
        const session = await sessionController.createSession(req.body.allowedUsers);
        return res.status(201).send(session);
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .send({ message: "Internal server error", error: err });
    }
});
exports.sessionRouter.put("/:id", async (req, res) => {
    if (!req.body.allowedUsers ||
        !Array.isArray(req.body.allowedUsers) ||
        req.body.allowedUsers.length === 0) {
        res.status(400).send("Bad request, allowedUsers must be a non-empty array");
        return;
    }
    try {
        await sessionController.updateSession(req.params.id, req.body.allowedUsers);
        return res.status(200).send();
    }
    catch (err) {
        console.error(err);
        if (err instanceof session_controller_1.SessionControllerExceptions.SessionNotFound) {
            return res.status(404).send({ message: "Session not found", error: err });
        }
        return res
            .status(500)
            .send({ message: "Internal server error", error: err });
    }
});
