const isProduction = process.env.NODE_ENV === "production";
const configuredSameSite = process.env.COOKIE_SAME_SITE?.toLowerCase();
const sameSite = ["lax", "strict", "none"].includes(configuredSameSite)
    ? configuredSameSite
    : isProduction ? "none" : "lax";

export const authCookieOptions = {
    httpOnly: true,
    secure: isProduction || process.env.COOKIE_SECURE === "true",
    sameSite,
    maxAge: 3 * 24 * 60 * 60 * 1000,
};

export const logoutCookieOptions = {
    httpOnly: true,
    secure: authCookieOptions.secure,
    sameSite: authCookieOptions.sameSite,
};
