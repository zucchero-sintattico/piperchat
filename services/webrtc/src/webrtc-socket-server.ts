import { Server, Socket } from "socket.io";
import { decodeAccessToken, isAccessTokenValid } from "./utils/jwt";
import http from "http";
import { SessionRepository } from "./repositories/session/session-repository";
import { SessionRepositoryImpl } from "./repositories/session/session-repository-impl";
export class WebRTCSocketServer {
	private sessionRepository: SessionRepository = new SessionRepositoryImpl();
	private io: Server;
	// private sessions: Map<string, Map<string, Socket>> = new Map();

	constructor(server: http.Server) {
		this.io = new Server(server, {
			cors: {
				origin: "*",
			},
		});
		this.io.on("connection", (socket) => {
			if (!isAccessTokenValid(socket.handshake.auth.token)) {
				console.log("Invalid token");
				socket.disconnect();
				return;
			}
			const username = decodeAccessToken(socket.handshake.auth.token)?.username;
			if (username) {
				this.handleSocket(socket, username);
			}
		});
	}

	async handleSocket(socket: Socket, username: string) {
		console.log("Socket connected", socket.id, username);

		socket.on("join-room", async (roomId) => {
			console.log("Joining room", roomId);

			const users = await this.sessionRepository.getUsersInSession(roomId);
			if (username in users) {
				console.log("Already in room, disconnecting");
				socket.disconnect();
				socket.to(roomId).emit("user-disconnected", username);
				return;
			}

			await this.sessionRepository.addNewUserToSession(
				roomId,
				username,
				socket.id
			);

			socket.to(roomId).emit("user-connected", username);
			socket.join(roomId);

			socket.on("disconnect", () => {
				socket.to(roomId).emit("user-disconnected", username);
			});

			socket.on("offer", async (offer, to) => {
				const socketId =
					await this.sessionRepository.getSocketIdBySessionIdAndUsername(
						roomId,
						to
					);
				this.io.sockets.sockets.get(socketId)?.emit("offer", offer, username);
			});

			socket.on("answer", async (answer, to) => {
				const socketId =
					await this.sessionRepository.getSocketIdBySessionIdAndUsername(
						roomId,
						to
					);
				this.io.sockets.sockets.get(socketId)?.emit("answer", answer, username);
			});

			socket.on("ice-candidate", async (candidate, to) => {
				const socketId =
					await this.sessionRepository.getSocketIdBySessionIdAndUsername(
						roomId,
						to
					);
				this.io.sockets.sockets
					.get(socketId)
					?.emit("ice-candidate", candidate, username);
			});
		});
	}
}
