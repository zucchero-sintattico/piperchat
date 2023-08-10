import { MultimediaChannel } from "../../models/multimedia-channel-model";
export interface MultimediaChannelController {
    /**
     * Create a multimedia channel
     * @param serverId
     * @param name
     * @returns the created multimedia channel
     * @throws {ServerNotFound} if the server does not exist
     * @throws {UserNotAuthorized} if the user is not the owner of the server
     * @throws {MultimediaChannelAlreadyExists} if the multimedia channel already exists
     * @throws {MultimediaChannelNameInvalid} if the multimedia channel name is invalid
     */
    createMultimediaChannel(serverId: number, name: string): Promise<MultimediaChannel>;
    /**
     * Update a multimedia channel
     * @param id
     * @param name? the new name of the multimedia channel
     * @returns the updated multimedia channel
     * @throws {MultimediaChannelNotFound} if the multimedia channel does not exist
     * @throws {UserNotAuthorized} if the user is not the owner of the server
     * @throws {MultimediaChannelNameInvalid} if the multimedia channel name is invalid
     * @throws {MultimediaChannelAlreadyExists} if the multimedia channel already exists
     */
    updateMultimediaChannel(id: number, name?: string): Promise<MultimediaChannel>;
    /**
     * Delete a multimedia channel
     * @param id
     * @returns the deleted multimedia channel
     * @throws {MultimediaChannelNotFound} if the multimedia channel does not exist
     * @throws {UserNotAuthorized} if the user is not the owner of the server
     */
    deleteMultimediaChannel(id: number): Promise<MultimediaChannel>;
}
export declare class MultimediaChannelControllerExceptions {
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
    static MultimediaChannelAlreadyExists: {
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
    static MultimediaChannelNameInvalid: {
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
