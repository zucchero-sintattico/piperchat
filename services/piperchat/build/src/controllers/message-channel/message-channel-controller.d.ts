import { MessageChannel } from "../../models/message-channel-model";
export interface MessageChannelController {
    /**
     * Create a message channel
     * @param serverId
     * @param name
     * @returns the created message channel
     * @throws {ServerNotFound} if the server does not exist
     * @throws {UserNotAuthorized} if the user is not the owner of the server
     * @throws {MessageChannelAlreadyExists} if the message channel already exists
     * @throws {MessageChannelNameInvalid} if the message channel name is invalid
     */
    createMessageChannel(serverId: number, name: string): Promise<MessageChannel>;
    /**
     * Update a message channel
     * @param id
     * @param name? the new name of the message channel
     * @returns the updated message channel
     * @throws {MessageChannelNotFound} if the message channel does not exist
     * @throws {UserNotAuthorized} if the user is not the owner of the server
     * @throws {MessageChannelNameInvalid} if the message channel name is invalid
     * @throws {MessageChannelAlreadyExists} if the message channel already exists
     */
    updateMessageChannel(id: number, name?: string): Promise<MessageChannel>;
    /**
     * Delete a message channel
     * @param id
     * @returns the deleted message channel
     * @throws {MessageChannelNotFound} if the message channel does not exist
     * @throws {UserNotAuthorized} if the user is not the owner of the server
     */
    deleteMessageChannel(id: number): Promise<MessageChannel>;
}
export declare class MessageChannelControllerExceptions {
    static ServerNotFound: {
        new (message?: string | undefined): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
        new (message?: string | undefined, options?: ErrorOptions | undefined): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    static UserNotAuthorized: {
        new (message?: string | undefined): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
        new (message?: string | undefined, options?: ErrorOptions | undefined): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    static MessageChannelAlreadyExists: {
        new (message?: string | undefined): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
        new (message?: string | undefined, options?: ErrorOptions | undefined): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    static MessageChannelNameInvalid: {
        new (message?: string | undefined): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
        new (message?: string | undefined, options?: ErrorOptions | undefined): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    static MessageChannelNotFound: {
        new (message?: string | undefined): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
        new (message?: string | undefined, options?: ErrorOptions | undefined): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
}
