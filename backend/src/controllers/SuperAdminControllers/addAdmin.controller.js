import orgModel from "../../models/org.model.js";
import userModel from "../../models/user.model.js";
import { ROLE_PERMISSIONS } from "../../constants/permissions.js";

export const addAdminController = async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth, designation, organizationId } = req.body;

        if (!firstName || !lastName || !email || !password || !dateOfBirth || !designation || !organizationId) {
            return res.status(400).json({
                success: false,
                message: "All fields including organizationId are required",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        const parsedDOB = new Date(dateOfBirth);
        if (isNaN(parsedDOB.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD",
            });
        }

        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        if (!normalizedEmail) {
            return res.status(400).json({ success: false, message: "A valid email is required" });
        }

        const existingUser = await userModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        const organization = await orgModel.findById(organizationId);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
            });
        }

        if (organization.status !== "ACTIVE") {
            return res.status(400).json({ success: false, message: "Admins can only be added to active organizations" });
        }

        const newAdmin = await userModel.create({
            firstName,
            lastName,
            email: normalizedEmail,
            password,
            dateOfBirth: parsedDOB,
            designation,
            role: "ADMIN",
            organizationId: organizationId,
            permissions: ROLE_PERMISSIONS["ADMIN"] || [],
        });

        return res.status(201).json({
            success: true,
            message: "Admin added successfully",
            admin: newAdmin,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while adding admin",
        });
    }
};
