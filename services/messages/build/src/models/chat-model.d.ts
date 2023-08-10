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
/// <reference types="mongoose/types/inferschematype" />
import { Schema } from "mongoose";
declare const Conversations: import("mongoose").Model<{
    name: string;
    messages: import("mongoose").Types.DocumentArray<{
        content: string;
        timecreated: Date;
        sender?: string | undefined;
    }>;
    participants: string[];
    id?: string | undefined;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
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
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    name: string;
    messages: import("mongoose").Types.DocumentArray<{
        content: string;
        timecreated: Date;
        sender?: string | undefined;
    }>;
    participants: string[];
    id?: string | undefined;
}, import("mongoose").Document<unknown, {}, {
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
}>>;
declare const Messages: import("mongoose").Model<{
    content: string;
    timecreated: Date;
    sender?: string | undefined;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    content: string;
    timecreated: Date;
    sender?: string | undefined;
}> & {
    content: string;
    timecreated: Date;
    sender?: string | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    content: string;
    timecreated: Date;
    sender?: string | undefined;
}, import("mongoose").Document<unknown, {}, {
    content: string;
    timecreated: Date;
    sender?: string | undefined;
}> & {
    content: string;
    timecreated: Date;
    sender?: string | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
}>>;
declare const Channels: import("mongoose").Model<{
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
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
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
}> & {
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
} & {
    _id: import("mongoose").Types.ObjectId;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
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
}, import("mongoose").Document<unknown, {}, {
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
}> & {
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
} & {
    _id: import("mongoose").Types.ObjectId;
}>>;
declare const Servers: import("mongoose").Model<{
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
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
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
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
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
}, import("mongoose").Document<unknown, {}, {
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
}>>;
export { Conversations, Messages, Channels, Servers };
