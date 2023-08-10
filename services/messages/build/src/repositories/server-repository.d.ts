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
export declare class ServersRepository {
    getServerById(id: String): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    }> & {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getServerByName(name: String): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    }> & {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getServersByUsername(username: String): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    }> & {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    createServer(name: String, description: String, creator: String, members: String[], channels: String[]): Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    }> & {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateServer(name: String, description: String): Promise<import("mongoose").UpdateWriteOpResult>;
    deleteServer(serverId: String): Promise<import("mongodb").DeleteResult>;
    getAllServers(): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    }> & {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    addMemberToServer(id: String, member: String): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    }> & {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    removeMemberFromServer(id: String, member: String): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    }> & {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    addChannelToServer(id: String, channel: String): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    }> & {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    removeChannelFromServer(id: String, channel: String): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    }> & {
        name: string;
        creator: string;
        members: string[];
        channels: import("mongoose").Types.DocumentArray<{
            type: string;
            name: string;
            creator: string;
            members: string[];
            messages: import("mongoose").Types.DocumentArray<{
                content: string;
                timecreated: Date;
                sender?: string | undefined;
            }>;
            id?: string | undefined;
            description?: string | undefined;
        }>;
        id?: string | undefined;
        description?: string | undefined;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
}
