"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebRTCServer = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const router_1 = require("./routes/router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const webrtc_socket_server_1 = require("./webrtc-socket-server");
class WebRTCServer {
    port;
    app;
    webRTCSocketServer;
    server;
    constructor(port) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.webRTCSocketServer = new webrtc_socket_server_1.WebRTCSocketServer(this.server);
        this.setupMiddleware();
        this.setupRouter();
    }
    setupMiddleware() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
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
exports.WebRTCServer = WebRTCServer;
