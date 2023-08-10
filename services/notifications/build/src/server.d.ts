/// <reference types="node" />
import http from "http";
export declare class NotificationsServer {
    private port;
    private app;
    server: http.Server;
    constructor(port: number);
    private setupMiddleware;
    private setupRouter;
    start(onStarted?: () => void): Promise<void>;
    stop(): void;
}
