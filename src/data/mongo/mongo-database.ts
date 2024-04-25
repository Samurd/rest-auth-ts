import mongoose from "mongoose";

interface ConectionOptions {
    mongoUrl: string
    dbName: string
}


export class MongoDatabase {
    static async connect(options: ConectionOptions) {
        const { mongoUrl, dbName } = options;

        try {
            await mongoose.connect(mongoUrl, { dbName });
            return true
        } catch (error) {
            console.log("Mongo connection failed");
            throw error;
        }

    }
}
