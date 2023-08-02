import http from "http";
import express from "express";
import { serviceRouter } from "./routes/router";
import {
	decodeAccessToken,
	isAccessTokenValid,
	jwtValidTokenRequired,
} from "./utils/jwt";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { handleSocket } from "./socket-handler";

export class WebRTCServer {
	private port: number;
	private app: express.Application;
	public server: http.Server;

	constructor(port: number) {
		this.port = port;
		this.app = express();
		this.server = http.createServer(this.app);
		this.setupMiddleware();
		this.setupRouter();
		this.setupSocket();
	}

	private setupMiddleware() {
		this.app.use(cookieParser());
		this.app.use(express.json());
	}

	private setupRouter() {
		this.app.use("/", serviceRouter);
	}

	private setupSocket() {
		const io = new Server(this.server, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
			},
		});

		io.on("connection", (socket) => {
			if (!isAccessTokenValid(socket.handshake.auth.token)) {
				console.log("Invalid token");
				socket.disconnect();
				return;
			}
			const username = decodeAccessToken(socket.handshake.auth.token)?.username;
			if (username) {
				handleSocket(socket, username);
			}
		});
	}

	async start(onStarted: () => void = () => {}) {
		return new Promise<void>((resolve, reject) => {
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
