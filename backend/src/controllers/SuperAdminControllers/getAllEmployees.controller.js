import userModel from "../../models/user.model.js";

export const getAllEmployeesDetails = async (req, res) => {

    try {
        const employees = await userModel
            .find({ role: { $ne: "SUPER_ADMIN" } })
            .select("firstName lastName email dateOfBirth designation role organizationId employmentStatus");

        return res.status(200).json({
            success: true,
            employees
        });
    } catch (error) {
        console.error("Get employee details error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
