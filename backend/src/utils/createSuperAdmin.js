import userModel from "../models/user.model.js";
import { ROLE_PERMISSIONS } from "../constants/permissions.js";

export const createSuperAdmin = async () => {
    try {
        const firstNameFromEnv = process.env.SUPER_ADMIN_FIRST_NAME;
        const emailFromEnv = process.env.SUPER_ADMIN_EMAIL.toLowerCase();
        const passwordFromEnv = process.env.SUPER_ADMIN_PASSWORD;

        if (!firstNameFromEnv || !emailFromEnv || !passwordFromEnv) throw new Error("Super admin configuration is missing");

        const existingSuperAdmin = await userModel.findOne({ role: "SUPER_ADMIN" });

        if (!existingSuperAdmin) {
            await userModel.create({
                firstName: firstNameFromEnv,
                lastName: "SHETTY",
                email: emailFromEnv,
                password: passwordFromEnv,
                role: "SUPER_ADMIN",
                dateOfBirth: new Date("2003-03-29"),
                designation: "Platform Owner",
                organizationId: null,
                permissions: ROLE_PERMISSIONS["SUPER_ADMIN"] || []
            });

            console.log("Super Admin created");
        }

    } catch (error) {
        throw error;
    }
};
