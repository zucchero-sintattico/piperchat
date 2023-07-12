import { Schema, model } from "mongoose";

type Image = {
	data: Buffer;
	contentType: string;
};

const UserSchema = new Schema({
	username: String,
	password: String,
	salt: String,
	email: String,
	photo: Image,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const User = model("User", UserSchema);

export { User };
