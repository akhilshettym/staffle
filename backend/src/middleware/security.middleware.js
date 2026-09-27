import mongoose from "mongoose";

export const securityHeaders = (req, res, next) => {
    res.set({
        "Content-Security-Policy": "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Resource-Policy": "same-site",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
    });
    next();
};

const hasUnsafeKey = (value) => {
    if (Array.isArray(value)) return value.some(hasUnsafeKey);
    if (!value || typeof value !== "object") return false;

    return Object.entries(value).some(([key, child]) =>
        key.startsWith("$") || key.includes(".") || hasUnsafeKey(child)
    );
};

export const rejectUnsafeRequestKeys = (req, res, next) => {
    if (hasUnsafeKey(req.body) || hasUnsafeKey(req.query) || hasUnsafeKey(req.params)) {
        return res.status(400).json({ success: false, message: "Invalid request payload" });
    }
    next();
};

export const validateObjectIdParams = (...names) => (req, res, next) => {
    const invalidName = names.find((name) => !mongoose.Types.ObjectId.isValid(req.params[name]));
    if (invalidName) {
        return res.status(400).json({ success: false, message: `Invalid ${invalidName}` });
    }
    next();
};

export const createRateLimiter = ({ windowMs, max }) => {
    const requests = new Map();

    return (req, res, next) => {
        if (req.method === "OPTIONS") return next();

        const now = Date.now();
        const key = req.ip || "unknown";
        const entry = requests.get(key);
        const active = !entry || now - entry.startedAt >= windowMs
            ? { startedAt: now, count: 0 }
            : entry;

        active.count += 1;
        requests.set(key, active);

        if (active.count > max) {
            res.set("Retry-After", String(Math.ceil((windowMs - (now - active.startedAt)) / 1000)));
            return res.status(429).json({ success: false, message: "Too many requests. Please try again later." });
        }

        if (requests.size > 10_000) {
            for (const [requestKey, request] of requests) {
                if (now - request.startedAt >= windowMs) requests.delete(requestKey);
            }
        }
        next();
    };
};
