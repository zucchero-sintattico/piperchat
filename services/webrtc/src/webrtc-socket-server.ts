import { Server, Socket } from "socket.io";
import { decodeAccessToken, isAccessTokenValid } from "./utils/jwt";
import http from "http";
import { SessionRepository } from "./repositories/session/session-repository";
import { SessionRepositoryImpl } from "./repositories/session/session-repository-impl";
import { SessionEventsRepository } from "./events/repositories/session/session-events-repository";
import { SessionEventsRepositoryImpl } from "./events/repositories/session/session-events-repository-impl";

export class WebRTCSocketServer {
	private sessionRepository: SessionRepository = new SessionRepositoryImpl();
	private sessionEventsRepository: SessionEventsRepository =
		new SessionEventsRepositoryImpl();
	private io: Server;

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
				socket.disconnect();
				return;
			}

			await this.sessionRepository.addNewUserToSession(
				sessionId,
				username,
				socket.id
			);

			socket.to(sessionId).emit("user-connected", username);
			socket.join(sessionId);
			this.sessionEventsRepository.publishUserJoinedSessionEvent(
				sessionId,
				username
			);

			socket.on("disconnect", () => {
				console.log("DISCONNECTING USER: ", username);
				socket.to(sessionId).emit("user-disconnected", username);
				this.sessionRepository.removeUserFromSession(sessionId, username);
				this.sessionEventsRepository.publishUserLeftSessionEvent(
					sessionId,
					username
				);
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
