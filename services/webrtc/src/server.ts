import http from "http";
import express from "express";
import { serviceRouter } from "./routes/router";
import { isAccessTokenValid, jwtValidTokenRequired } from "./utils/jwt";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

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

			console.log("New connection");

			socket.on("join-room", (roomId, userId) => {
				console.log("Joining room", roomId, userId);

				socket.join(roomId);
				socket.to(roomId).emit("user-connected", userId);

				socket.on("disconnect", () => {
					socket.to(roomId).emit("user-disconnected", userId);
				});

				socket.on("offer", (offer, userId) => {
					socket.to(roomId).emit("offer", offer, userId);
				});

				socket.on("answer", (answer, userId) => {
					socket.to(roomId).emit("answer", answer, userId);
				});

				socket.on("ice-candidate", (candidate, userId) => {
					socket.to(roomId).emit("ice-candidate", candidate, userId);
				});
			});
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
