/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
/**
 * The repository of the conversation entity.
 */
export declare class ConversationsRepository {
    getMessagesFromConversation(conversationId: String): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        messages: import("mongoose").Types.DocumentArray<{
            content: string;
            timecreated: Date;
            sender?: string | undefined;
        }>;
        participants: string[];
        id?: string | undefined;
    }> & {
        name: string;
        messages: import("mongoose").Types.DocumentArray<{
            content: string;
            timecreated: Date;
            sender?: string | undefined;
        }>;
        participants: string[];
        id?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getConversationsByUsername(username: String): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        messages: import("mongoose").Types.DocumentArray<{
            content: string;
            timecreated: Date;
            sender?: string | undefined;
        }>;
        participants: string[];
        id?: string | undefined;
    }> & {
        name: string;
        messages: import("mongoose").Types.DocumentArray<{
            content: string;
            timecreated: Date;
            sender?: string | undefined;
        }>;
        participants: string[];
        id?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    createConversation(participants: String[]): Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        messages: import("mongoose").Types.DocumentArray<{
            content: string;
            timecreated: Date;
            sender?: string | undefined;
        }>;
        participants: string[];
        id?: string | undefined;
    }> & {
        name: string;
        messages: import("mongoose").Types.DocumentArray<{
            content: string;
            timecreated: Date;
            sender?: string | undefined;
        }>;
        participants: string[];
        id?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteConversation(name: String): Promise<void>;
    getAllConversations(): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        messages: import("mongoose").Types.DocumentArray<{
            content: string;
            timecreated: Date;
            sender?: string | undefined;
        }>;
        participants: string[];
        id?: string | undefined;
    }> & {
        name: string;
        messages: import("mongoose").Types.DocumentArray<{
            content: string;
            timecreated: Date;
            sender?: string | undefined;
        }>;
        participants: string[];
        id?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    addMessageToConversation(name: String, message: String): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        messages: import("mongoose").Types.DocumentArray<{
            content: string;
            timecreated: Date;
            sender?: string | undefined;
        }>;
        participants: string[];
        id?: string | undefined;
    }> & {
        name: string;
        messages: import("mongoose").Types.DocumentArray<{
            content: string;
            timecreated: Date;
            sender?: string | undefined;
        }>;
        participants: string[];
        id?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
}
