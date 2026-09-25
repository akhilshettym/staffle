import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

app.use
    (cors({
        origin: (origin, callback) => {
            const isProduction = process.env.NODE_ENV === "production";

            const allowedOrigins = isProduction
                ? [
                    process.env.CLIENT_URL,
                    ...parseOrigins(process.env.CLIENT_URL)
                ].filter(Boolean)
                : [
                    "http://localhost:3000",
                    "http://localhost:5173",
                    process.env.CLIENT_URL,
                    ...parseOrigins(process.env.CLIENT_URL)
                ].filter(Boolean);

            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`CORS Blocked Request from Origin: "${origin}"`);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        maxAge: 86400,
    })
    );

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

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

    const statusCode = err.statusCode || 500;
    const message = err.message || "An unexpected server error occured";

    const responseMessage = process.env.NODE_ENV === "production" ? "Internal Server Error" : message;

    res.status(statusCode).json({
        success: false,
        message: responseMessage,
        ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
});

export default app;