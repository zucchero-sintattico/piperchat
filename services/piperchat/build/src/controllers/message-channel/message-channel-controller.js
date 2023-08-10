"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageChannelControllerExceptions = void 0;
class MessageChannelControllerExceptions {
    static ServerNotFound = class extends Error {
    };
    static UserNotAuthorized = class extends Error {
    };
    static MessageChannelAlreadyExists = class extends Error {
    };
    static MessageChannelNameInvalid = class extends Error {
    };
    static MessageChannelNotFound = class extends Error {
    };
}
exports.MessageChannelControllerExceptions = MessageChannelControllerExceptions;
