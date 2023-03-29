import mongoose from "mongoose";
export class MongooseUtils {
	static async initialize(connectionUri: string) {
		await mongoose.connect(connectionUri);
	}
}
