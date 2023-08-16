export class MongooseUtils {
	static async initialize(mongoose: any, connectionUri: string) {
		try {
			await mongoose.connect(connectionUri);
			console.log("Connected to MongoDB");
		} catch (err) {
			console.error(err);
		}
	}

	static async close(mongoose: any) {
		await mongoose.disconnect();
	}

	static async clear(mongoose: any) {
		const collections = mongoose.connection.collections;
		for (const key in collections) {
			const collection = collections[key];
			await collection?.deleteMany({});
		}
	}
}
