import { Schema, model } from "mongoose";

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
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
});

const User = model("User", UserSchema);

export { User };
