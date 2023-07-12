import { Schema, model } from "mongoose";

const UserSchema = new Schema({
	username: String,
	password: String,
	salt: String,
	email: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const User = model("User", UserSchema);

export { User };
