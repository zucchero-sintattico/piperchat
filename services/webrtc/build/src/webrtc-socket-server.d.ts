/// <reference types="node" />
import { Socket } from "socket.io";
import http from "http";
export declare class WebRTCSocketServer {
    private sessionRepository;
    private sessionEventsRepository;
    private io;
    constructor(server: http.Server);
    handleSocket(socket: Socket, username: string): Promise<void>;
}
