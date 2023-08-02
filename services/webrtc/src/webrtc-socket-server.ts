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

		socket.on("join-room", async (sessionId) => {
			console.log("Joining room", sessionId);

			try {
				const session = await this.sessionRepository.getSessionById(sessionId);
			} catch (e) {
				console.log("Session does not exist, creating new one");
				await this.sessionRepository.createNewSession(sessionId);
			}

			const users = await this.sessionRepository.getUsersInSession(sessionId);

			const userInSession = users.find((user) => user.username === username);
			if (userInSession) {
				console.log("User already in session");
				this.io.sockets.sockets.get(userInSession.socketId)?.disconnect();
				socket.to(sessionId).emit("user-disconnected", username);
				await this.sessionRepository.removeUserFromSession(
					sessionId,
					userInSession.username
				);
			}

			await this.sessionRepository.addNewUserToSession(
				sessionId,
				username,
				socket.id
			);

			socket.to(sessionId).emit("user-connected", username);
			socket.join(sessionId);

			socket.on("disconnect", () => {
				socket.to(sessionId).emit("user-disconnected", username);
			});

			socket.on("offer", async (offer, to) => {
				const socketId =
					await this.sessionRepository.getSocketIdBySessionIdAndUsername(
						sessionId,
						to
					);
				this.io.sockets.sockets.get(socketId)?.emit("offer", offer, username);
			});

			socket.on("answer", async (answer, to) => {
				const socketId =
					await this.sessionRepository.getSocketIdBySessionIdAndUsername(
						sessionId,
						to
					);
				this.io.sockets.sockets.get(socketId)?.emit("answer", answer, username);
			});

			socket.on("ice-candidate", async (candidate, to) => {
				const socketId =
					await this.sessionRepository.getSocketIdBySessionIdAndUsername(
						sessionId,
						to
					);
				this.io.sockets.sockets
					.get(socketId)
					?.emit("ice-candidate", candidate, username);
			});
		});
	}
}
