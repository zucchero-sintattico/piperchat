import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
	source: String,
	destination: String,
	// TODO - add more fields
});

const MessageEntity = model("Entity", MessageSchema);

export { MessageEntity };
