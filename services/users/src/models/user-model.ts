import { Schema, model } from "mongoose";

export interface User {
	username: string;
	email: string;
	password: string;
	createdAt: Date;
	online: boolean;
	lastActive: Date;
	refreshToken: string;
}

export const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	online: {
		type: Boolean,
		default: false,
	},
	lastActive: {
		type: Date,
		default: Date.now,
	},
	refreshToken: {
		type: String,
		default: "",
	},
});

export const Users = model<User>("User", UserSchema);
