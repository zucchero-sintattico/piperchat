import { Schema, model } from "mongoose";

const MessageMonitorSchema = new Schema({
	messageID: {
		type: String,
		required: true,
	},
	source: {
		type: String,
		required: true,
	},
	destination: {
		type: String,
		required: true,
	},
});

const MessageMonitorEntity = model("Entity", MessageMonitorSchema);

export { MessageMonitorEntity };