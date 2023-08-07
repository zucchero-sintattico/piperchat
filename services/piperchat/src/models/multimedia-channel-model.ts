import { Schema, model } from "mongoose";

export interface MultimediaChannel {
	id: number;
	name: string;
	createdAt: Date;
	activeSession: string;
}

export const MultimediaChannelSchema = new Schema<MultimediaChannel>({
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
	activeSession: {
		type: String,
		required: false,
	},
});

export const MultimediaChannels = model<MultimediaChannel>(
	"MultimediaChannel",
	MultimediaChannelSchema
);
