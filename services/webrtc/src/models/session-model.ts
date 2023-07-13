import { Schema, model } from "mongoose";

const SessionSchema = new Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	users: {
		type: Array,
		required: true,
		fields: {
			userId: {
				type: String,
				required: true,
			},
			sdp: {
				type: String,
				required: true,
			},
		},
	},
});

const Session = model("Session", SessionSchema);

export { Session };
