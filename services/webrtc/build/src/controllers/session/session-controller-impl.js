"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionControllerImpl = void 0;
const session_repository_impl_1 = require("../../repositories/session/session-repository-impl");
class SessionControllerImpl {
    sessionRepository = new session_repository_impl_1.SessionRepositoryImpl();
    async createSession(allowedUsers) {
        return await this.sessionRepository.createNewSession(allowedUsers);
    }
    async updateSession(id, allowedUsers) {
        return await this.sessionRepository.updateSessionAllowedUsers(id, allowedUsers);
    }
}
exports.SessionControllerImpl = SessionControllerImpl;
