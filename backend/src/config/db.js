import mongoose from "mongoose";

const connectDB = async () => {
    // mongoose.set("sanitizeFilter", true);

    mongoose.connection.on("connected", () => {
        console.log("MongoDB lifecycle event: Connection established successfully.");
    });

    mongoose.connection.on("error", (err) => {
        console.error(`MongoDB runtime network/driver error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("Mongoose lifecycle event: Connection dropped. Retrying...");
    });

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Server connected to DB");
    } catch (error) {
        console.error("Critical: Initial MongoDB connection failed ->", error?.message);
        throw error;
    }
};

export default connectDB;