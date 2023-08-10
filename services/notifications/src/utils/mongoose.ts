import mongoose from "mongoose";
export class MongooseUtils {
	static async initialize(connectionUri: string) {
		try {
			await mongoose.connect(connectionUri);
		} catch (err) {
			console.error(err);
		}
	}

	static async disconnect() {
		try {
			await mongoose.disconnect();
		} catch (err) {
			console.error(err);
		}
	}
}
