import jwt from "jsonwebtoken";
import userModel from "../../models/user.model.js";
import orgModel from "../../models/org.model.js";
import { authCookieOptions } from "../../utils/cookieOptions.js";

export async function userLoginController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase();

        const user = await userModel
            .findOne({ email: normalizedEmail })
            .select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email or password is invalid"
            });
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Email or password is invalid"
            });
        }

        if (user.employmentStatus === "IN-ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Contact system administrator."
            });
        }

        if (user.role !== "SUPER_ADMIN") {

            if (!user.organizationId) {
                return res.status(403).json({
                    success: false,
                    message: "User does not belong to any organization"
                });
            }

            const organization = await orgModel.findById(user.organizationId);

            if (!organization) {
                return res.status(403).json({
                    success: false,
                    message: "Organization not found"
                });
            }

            if (organization.status === "PENDING") {
                return res.status(403).json({
                    success: false,
                    message: "Your organization is pending approval. You will be able to login once it is approved."
                });
            }

            if (organization.status === "REJECTED") {
                return res.status(403).json({
                    success: false,
                    message: "Your organization request has been rejected. Please contact support."
                });
            }

            if (organization.status === "REVOKED") {
                return res.status(403).json({
                    success: false,
                    message: "Your organization access has been revoked. Please contact system administrator."
                });
            }

            if (organization.status !== "ACTIVE") {
                return res.status(403).json({
                    success: false,
                    message: `Organization is currently ${organization.status}. Login not allowed.`
                });
            }
        }

        const token = jwt.sign({
            userId: user._id,
            role: user.role,
            orgId: user.organizationId
        },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token, authCookieOptions);

        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                uuid: user.uuid,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                organizationId: user.organizationId
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
}
