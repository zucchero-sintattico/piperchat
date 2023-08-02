import { Schema, model } from "mongoose";

export interface UserInSession {
	username: string;
	socketId: string;
}
export interface Session {
	id: string;
	createdAt: Date;
	participants: UserInSession[];
}

const SessionSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true,
		auto: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	participants: {
		type: [
			{
				username: {
					type: String,
					required: true,
				},
				socketId: {
					type: String,
					required: true,
				},
			},
		],
		required: true,
		default: [],
	},
});

const Sessions = model("Session", SessionSchema);

export { Sessions };
