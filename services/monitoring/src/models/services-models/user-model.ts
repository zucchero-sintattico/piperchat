import { Schema, model } from "mongoose";

const UserMonitorSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	event: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

const UserMonitorEntity = model("UserMonitorSchema", UserMonitorSchema);

export { UserMonitorEntity };