"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebRTCSocketServer = void 0;
const socket_io_1 = require("socket.io");
const jwt_1 = require("@piperchat/commons/src/jwt");
const session_repository_impl_1 = require("./repositories/session/session-repository-impl");
const session_events_repository_impl_1 = require("./events/repositories/session/session-events-repository-impl");
class WebRTCSocketServer {
    sessionRepository = new session_repository_impl_1.SessionRepositoryImpl();
    sessionEventsRepository = new session_events_repository_impl_1.SessionEventsRepositoryImpl();
    io;
    constructor(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
            },
        });
        this.io.on("connection", (socket) => {
            if (!(0, jwt_1.isAccessTokenValid)(socket.handshake.auth.token)) {
                console.log("Invalid token");
                socket.disconnect();
                return;
            }
            const username = (0, jwt_1.decodeAccessToken)(socket.handshake.auth.token)?.username;
            if (username) {
                this.handleSocket(socket, username);
            }
        });
    }
    async handleSocket(socket, username) {
        console.log("Socket connected", socket.id, username);
        socket.on("join-room", async (sessionId) => {
            console.log("Joining room", sessionId);
            try {
                const session = await this.sessionRepository.getSessionById(sessionId);
                const isUserAllowedInSession = session.allowedUsers.includes(username);
                if (!isUserAllowedInSession) {
                    console.log("User not allowed in session");
                    socket.disconnect();
                    return;
                }
            }
            catch (e) {
                console.log("Session does not exist");
                socket.disconnect();
                return;
            }
            const usersAlreadyInSession = await this.sessionRepository.getUsersInSession(sessionId);
            const isUserAlreadyInSession = usersAlreadyInSession.find((user) => user.username === username);
            if (isUserAlreadyInSession) {
                console.log("User already in session, disconnecting");
                socket.disconnect();
                return;
            }
            await this.sessionRepository.addNewUserToSession(sessionId, username, socket.id);
            socket.to(sessionId).emit("user-connected", username);
            socket.join(sessionId);
            this.sessionEventsRepository.publishUserJoinedSessionEvent(sessionId, username);
            socket.on("disconnect", async () => {
                console.log("DISCONNECTING USER: ", username);
                socket.to(sessionId).emit("user-disconnected", username);
                this.sessionRepository.removeUserFromSession(sessionId, username);
                this.sessionEventsRepository.publishUserLeftSessionEvent(sessionId, username);
                const usersInSession = await this.sessionRepository.getUsersInSession(sessionId);
                if (usersInSession.length === 0) {
                    this.sessionEventsRepository.publishSessionEndedEvent(sessionId);
                }
            });
            socket.on("offer", async (offer, to) => {
                const socketId = await this.sessionRepository.getSocketIdBySessionIdAndUsername(sessionId, to);
                this.io.sockets.sockets.get(socketId)?.emit("offer", offer, username);
            });
            socket.on("answer", async (answer, to) => {
                const socketId = await this.sessionRepository.getSocketIdBySessionIdAndUsername(sessionId, to);
                this.io.sockets.sockets.get(socketId)?.emit("answer", answer, username);
            });
            socket.on("ice-candidate", async (candidate, to) => {
                const socketId = await this.sessionRepository.getSocketIdBySessionIdAndUsername(sessionId, to);
                this.io.sockets.sockets
                    .get(socketId)
                    ?.emit("ice-candidate", candidate, username);
            });
        });
    }
}
exports.WebRTCSocketServer = WebRTCSocketServer;
