"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultimediaChannelControllerExceptions = void 0;
class MultimediaChannelControllerExceptions {
    static ServerNotFound = class extends Error {
    };
    static UserNotAuthorized = class extends Error {
    };
    static MultimediaChannelAlreadyExists = class extends Error {
    };
    static MultimediaChannelNameInvalid = class extends Error {
    };
}
exports.MultimediaChannelControllerExceptions = MultimediaChannelControllerExceptions;
