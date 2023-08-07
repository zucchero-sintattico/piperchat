import { Schema, model } from "mongoose";

export interface MessageChannel {
	id: number;
	name: string;
	createdAt: Date;
}

export const MessageChannelSchema = new Schema<MessageChannel>({
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
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

export const MessageChannels = model<MessageChannel>(
	"MessageChannel",
	MessageChannelSchema
);
