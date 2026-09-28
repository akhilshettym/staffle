import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createRateLimiter, rejectUnsafeRequestKeys, securityHeaders } from "./middleware/security.middleware.js";

import authRouter from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import adminRoute from "./routes/admin.routes.js";
import employeeRouter from "./routes/employee.routes.js";
import superadminRoutes from "./routes/superadmin.routes.js";
import organizationRoutes from "./routes/organization.routes.js";

const app = express();

app.set("trust proxy", 1);

const parseOrigins = (value) =>
    value
        ?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) || [];

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = isProduction
    ? parseOrigins(process.env.CLIENT_URL)
    : ["http://localhost:3000", "http://localhost:5173", ...parseOrigins(process.env.CLIENT_URL)];

const isLocalDeployment = parseOrigins(process.env.CLIENT_URL).some((origin) => {
    try {
        return ["localhost", "127.0.0.1", "::1"].includes(new URL(origin).hostname);
    } catch {
        return false;
    }
});

const isLoopbackDevelopmentOrigin = (origin) => {
    if (isProduction && !isLocalDeployment) return false;

    try {
        const url = new URL(origin);
        return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    } catch {
        return false;
    }
};

app.use(securityHeaders);

app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || isLoopbackDevelopmentOrigin(origin)) {
                callback(null, true);
            } else {
                const error = new Error("Origin is not allowed");
                error.statusCode = 403;
                callback(error);
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        maxAge: 86400,
    }));

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(rejectUnsafeRequestKeys);

app.use("/api/auth/login", createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }));
app.use("/api/auth/create-organization", createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }));

app.get("/api/ping", (req, res) => {
    res.json({ success: true, message: "pong" });
});

/* use routes */
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/organization", organizationRoutes);
app.use("/api/employee", employeeRouter);
app.use("/api/superadmin", superadminRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.path}`,
    });
});

app.use((err, req, res, next) => {
    console.error("Error: ", {
        message: err.message,
        status: err.statusCode || 500,
        path: req.path,
        method: req.method,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });

    const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
    const message = err.message || "An unexpected server error occurred";

    const responseMessage = process.env.NODE_ENV === "production" ? "Internal Server Error" : message;

    res.status(statusCode).json({
        success: false,
        message: responseMessage,
        ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
});

export default app;
