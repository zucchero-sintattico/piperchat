import { Response } from "express";

export class ClientProxy {

    private readonly socket: Response;

    constructor(socket: Response) {
        this.socket = socket;
    }

    public send(data: any) {
        this.socket.write(`data: ${JSON.stringify(data)}\n\n`);
    }

}
