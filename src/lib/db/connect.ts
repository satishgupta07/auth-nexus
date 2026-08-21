import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
};

declare global {
    var _mongooseConn: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis._mongooseConn ?? {
    conn: null,
    promise: null,
};
globalThis._mongooseConn = cached;

export async function connectDB(): Promise<Mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI is not set");

        cached.promise = mongoose.connect(uri, { bufferCommands: false });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
