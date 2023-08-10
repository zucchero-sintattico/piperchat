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
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export declare class EntityRepository {
    getEntities(): Promise<(import("mongoose").Document<unknown, {}, {
        to: string;
        messageId: string;
        notitificationType: string;
        from?: string | undefined;
    }> & {
        to: string;
        messageId: string;
        notitificationType: string;
        from?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getEntityById(id: string): Promise<(import("mongoose").Document<unknown, {}, {
        to: string;
        messageId: string;
        notitificationType: string;
        from?: string | undefined;
    }> & {
        to: string;
        messageId: string;
        notitificationType: string;
        from?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    createEntity(entity: any): Promise<import("mongoose").Document<unknown, {}, {
        to: string;
        messageId: string;
        notitificationType: string;
        from?: string | undefined;
    }> & {
        to: string;
        messageId: string;
        notitificationType: string;
        from?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateEntity(id: string, entity: any): Promise<(import("mongoose").Document<unknown, {}, {
        to: string;
        messageId: string;
        notitificationType: string;
        from?: string | undefined;
    }> & {
        to: string;
        messageId: string;
        notitificationType: string;
        from?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    deleteEntity(id: string): Promise<(import("mongoose").Document<unknown, {}, {
        to: string;
        messageId: string;
        notitificationType: string;
        from?: string | undefined;
    }> & {
        to: string;
        messageId: string;
        notitificationType: string;
        from?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
}
