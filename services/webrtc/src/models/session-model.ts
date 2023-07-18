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
			username: {
				type: String,
				required: true,
			},
			sdp: {
				type: String,
			},
			iceCandidates: {
				type: Array,
				fields: {
					candidate: {
						type: String,
					},
				},
			},
		},
	},
});

const Session = model("Session", SessionSchema);

export { Session };
