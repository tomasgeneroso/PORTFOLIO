import mongoose from 'mongoose';
const DATABASE_URL = process.env.DATABASE_URL || "Not found";
   
export default async function connectToDatabase() {
    try {
        let database = await mongoose.connect(DATABASE_URL);
        console.log("Connected to database successfully!",database);
        return database;
    } catch (error) {
        throw new Error("Failed to connect to database: " + error);
    }
}
 connectToDatabase();

