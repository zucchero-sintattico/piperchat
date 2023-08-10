/// <reference types="node" />
import http from "http";
export declare class WebRTCServer {
    private port;
    private app;
    private webRTCSocketServer;
    server: http.Server;
    constructor(port: number);
    private setupMiddleware;
    private setupRouter;
    start(onStarted?: () => void): Promise<void>;
    stop(): void;
}
