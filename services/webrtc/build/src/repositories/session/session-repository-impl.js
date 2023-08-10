"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepositoryImpl = void 0;
const session_model_1 = require("../../models/session-model");
class SessionRepositoryImpl {
    async removeUserFromSession(sessionId, username) {
        const session = await this.getSessionById(sessionId);
        const user = session.participants.find((user) => user.username === username);
        if (!user) {
            throw new Error("User does not exist in session");
        }
        await session_model_1.Sessions.updateOne({ id: sessionId }, { $pull: { participants: { username: username } } });
    }
    async getSocketIdBySessionIdAndUsername(sessionId, username) {
        const session = await this.getSessionById(sessionId);
        const user = session.participants.find((user) => user.username === username);
        if (!user) {
            throw new Error("User does not exist in session");
        }
        return user.socketId;
    }
    async getSessionById(id) {
        return await session_model_1.Sessions.findOne({ id: id }).orFail();
    }
    async createNewSession(allowedUsers) {
        const session = new session_model_1.Sessions({
            allowedUsers: allowedUsers,
        });
        await session.save();
        return session;
    }
    async addNewUserToSession(sessionId, username, socketId) {
        await session_model_1.Sessions.updateOne({ id: sessionId }, {
            $push: {
                participants: {
                    username: username,
                    socketId: socketId,
                },
            },
        });
    }
    async getUsersInSession(sessionId) {
        const session = await session_model_1.Sessions.findOne({ id: sessionId }).orFail();
        return session.participants;
    }
    async updateSessionAllowedUsers(sessionId, allowedUsers) {
        await session_model_1.Sessions.updateOne({ id: sessionId }, { allowedUsers: allowedUsers });
    }
}
exports.SessionRepositoryImpl = SessionRepositoryImpl;
