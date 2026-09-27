import { logoutCookieOptions } from "../../utils/cookieOptions.js";

export async function userLogoutController(req, res) {

    try {
        res.clearCookie("token", logoutCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during logout",
        });
    }
}
