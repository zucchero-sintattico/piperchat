import http from "http";
import express from "express";
import { serviceRouter } from "./routes/router";
import { jwtValidTokenRequired } from "./utils/jwt";
import cookieParser from "cookie-parser";

export class MonitoringServer {
	private port: number;
	private app: express.Application;
	public server: http.Server;

	constructor(port: number) {
		this.port = port;
		this.app = express();
		this.server = http.createServer(this.app);
		this.setupMiddleware();
		this.setupRouter();
	}

	private setupMiddleware() {
		this.app.use(express.json());
		this.app.use(cookieParser());
	}

	private setupRouter() {
		this.app.use("/", serviceRouter);
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
