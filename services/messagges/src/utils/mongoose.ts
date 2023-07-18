import mongoose from "mongoose";
export class MongooseUtils {
	static async initialize(connectionUri: string) {
		try {
			await mongoose.connect(connectionUri);
			console.log("Connected to MongoDB");
		} catch (err) {
			console.error(err);
		}
	}

	static async close() {
		await mongoose.disconnect();
	}
}