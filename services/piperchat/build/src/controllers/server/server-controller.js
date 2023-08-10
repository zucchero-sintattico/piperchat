"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerControllerExceptions = void 0;
class ServerControllerExceptions {
    static UserNotFound = class extends Error {
    };
    static ServerNotFound = class extends Error {
    };
    static UserNotAuthorized = class extends Error {
    };
    static UserAlreadyJoined = class extends Error {
    };
}
exports.ServerControllerExceptions = ServerControllerExceptions;
