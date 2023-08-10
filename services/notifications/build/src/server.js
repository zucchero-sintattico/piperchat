"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsServer = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const router_1 = require("./routes/router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class NotificationsServer {
    port;
    app;
    server;
    constructor(port) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.setupMiddleware();
        this.setupRouter();
    }
    setupMiddleware() {
        this.app.use(express_1.default.json());
        this.app.use((0, cookie_parser_1.default)());
    }
    setupRouter() {
        this.app.use("/", router_1.serviceRouter);
    }
    async start(onStarted = () => { }) {
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, () => {
                onStarted();
                resolve();
            });
        });
    }
    stop() {
        this.server.close();
    }
}
exports.NotificationsServer = NotificationsServer;
