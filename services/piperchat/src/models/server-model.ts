import { Schema, model } from "mongoose";

export interface Server {
	id: number;
	name: string;
	description: string;
	owner: string;
	participants: string[];
	createdAt: Date;
}

export const ServerSchema = new Schema<Server>({
	id: {
		type: Number,
		required: true,
		unique: true,
		auto: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	owner: {
		type: String,
		required: true,
	},
	participants: {
		type: [String],
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

export const Servers = model<Server>("Server", ServerSchema);
