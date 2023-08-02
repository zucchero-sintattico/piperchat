import http from "http";
import { WebRTCSocketServer } from "./webrtc-socket-server";

export class WebRTCServer {
	private port: number;
	private webRTCSocketServer: WebRTCSocketServer;
	public server: http.Server;

	constructor(port: number) {
		this.port = port;
		this.server = http.createServer();
		this.webRTCSocketServer = new WebRTCSocketServer(this.server);
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
