import { Schema, model } from "mongoose";

export interface UserStatus {
    username: string;
    status?: string;
    lastActive?: Date;
}

const UserStatusSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        key: true,
    },
    status: {
        type: String,
    },
    lastActive: {
        type: Date,
    }
});

const UsersStatus = model<UserStatus>("UserStatus", UserStatusSchema);

export { UsersStatus };

