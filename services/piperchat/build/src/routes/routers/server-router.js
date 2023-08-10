"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverRouter = void 0;
const express_1 = require("express");
const server_controller_impl_1 = require("../../controllers/server/server-controller-impl");
const serverController = new server_controller_impl_1.ServerControllerImpl();
exports.serverRouter = (0, express_1.Router)();
exports.serverRouter.get("/", async (req, res) => {
    serverController
        .getServer(req.body.id)
        .then((server) => {
        res.status(200).json(server);
    })
        .catch((err) => {
        res.status(404).json(err);
    });
});
exports.serverRouter.get("/all", async (req, res) => {
    serverController
        .getServers(req.body.username)
        .then((servers) => {
        res.status(200).json(servers);
    })
        .catch((err) => {
        res.status(404).json(err);
    });
});
exports.serverRouter.post("/create", async (req, res) => {
    serverController
        .createServer(req.body.name, req.body.description, req.user.username)
        .then((server) => {
        res.status(200).json(server);
    })
        .catch((err) => {
        res.status(404).json(err);
    });
});
exports.serverRouter.post("/update", async (req, res) => {
    serverController
        .updateServer(req.body.id, req.body.name, req.body.description)
        .then((server) => {
        res.status(200).json(server);
    })
        .catch((err) => {
        res.status(404).json(err);
    });
});
exports.serverRouter.post("/delete", async (req, res) => {
    serverController
        .deleteServer(req.body.id)
        .then((server) => {
        res.status(200).json(server);
    })
        .catch((err) => {
        res.status(404).json(err);
    });
});
exports.serverRouter.post("/join", async (req, res) => {
    serverController
        .joinServer(req.body.id)
        .then((server) => {
        res.status(200).json(server);
    })
        .catch((err) => {
        res.status(404).json(err);
    });
});
exports.serverRouter.post("/leave", async (req, res) => {
    serverController
        .leaveServer(req.body.id)
        .then((server) => {
        res.status(200).json(server);
    })
        .catch((err) => {
        res.status(404).json(err);
    });
});
