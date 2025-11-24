import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const Connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (Connection.isConnected) {

        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        Connection.isConnected = db.connections[0].readyState;


    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}
export default dbConnect; 