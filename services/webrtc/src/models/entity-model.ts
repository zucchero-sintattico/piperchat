import { Schema, model } from "mongoose";

const EntitySchema = new Schema({
	name: String,
	description: String,
	createdAt: Date,
	updatedAt: Date,
});

const Entity = model("Entity", EntitySchema);

export { Entity };
