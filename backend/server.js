import 'dotenv/config';
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import startOverdueTaskJob from "./src/jobs/taskOverdue.js";
import { createSuperAdmin } from "./src/utils/createSuperAdmin.js";
import startInactiveEmployeeCleanupJob from './src/jobs/inactiveEmployee.js';

const requiredEnvVars = ["PORT", "NODE_ENV", "SUPER_ADMIN_FIRST_NAME", "CLIENT_URL", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "JWT_SECRET", "MONGO_URI"];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
    console.error(
        `/nFATAL ERROR: Missing required environment variables:\n${missingVars
            .map((v) => `   -${v}`)
            .join("\n")}\n\nPlease check your .env file and try again.`,
    );
    process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
    console.warn(
        "WARNING: JWT_SECRET is shorter than recommended (32+ characters). Consider using: openssl rand -base64 32",
    );
}

try {
    await connectDB();
    await createSuperAdmin();
} catch (error) {
    console.error("FATAL: System startup failed", error);
    process.exit(1);
}

try {
    startOverdueTaskJob();
    startInactiveEmployeeCleanupJob();
} catch (error) {
    console.error("FATAL: FATAL: Cron job failed to execute", error);
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    server.close(async () => {
        console.log("HTTP server closed");
        try {
            await mongoose.connection.close();
            console.log("MongoDB connection closed cleanly");
            process.exit(0);
        } catch (error) {
            console.error("Error closing MongoDB connection during shutdown: ", error);
            process.exit(1);
        }
    });

    setTimeout(() => {
        console.error("Forced shutdown after 10 seconds");
        process.exit(1);
    }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
    console.error("Critical Uncaught Exception: ", error);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at: ", promise, "reason: ", reason);
    process.exit(1);
});