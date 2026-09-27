import mongoose from "mongoose";
import userModel from "../../models/user.model.js";
import orgModel from "../../models/org.model.js";
import { ROLE_PERMISSIONS } from "../../constants/permissions.js";

export async function createOrganizationController(req, res) {

    const session = await mongoose.startSession();

    try {
        const { firstName, lastName, email, password, confirmPassword, dateOfBirth, designation, orgName, orgDomain, orgDescription, orgCountry } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !dateOfBirth || !designation || !orgName || !orgDomain || !orgDescription) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
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

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already in use",
            });
        }

        const existingOrg = await orgModel.findOne({ orgDomain });
        if (existingOrg) {
            return res.status(409).json({
                success: false,
                message: "Organization domain already taken",
            });
        }

        session.startTransaction();

        const [newOrg] = await orgModel.create(
            [
                {
                    orgName,
                    orgDomain,
                    orgDescription,
                    orgCountry: orgCountry || null,
                    status: "PENDING",
                    createdBy: null,
                },
            ],
            { session }
        );

        const [newUser] = await userModel.create(
            [
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    dateOfBirth: parsedDOB,
                    designation,
                    role: "ADMIN",
                    organizationId: newOrg._id,
                    permissions: ROLE_PERMISSIONS["ADMIN"] || [],
                },
            ],
            { session }
        );

        newOrg.createdBy = newUser._id;
        await newOrg.save({ session });

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Organization and admin account created successfully",
            organization: newOrg,
            user: newUser,
        });

    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({
            success: false,
            message: "Server error during organization creation",
        });

    } finally {
        session.endSession();
    }
}
