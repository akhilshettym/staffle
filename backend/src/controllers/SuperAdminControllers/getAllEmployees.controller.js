import userModel from "../../models/user.model.js";

export const getAllEmployeesDetails = async (req, res) => {


    // Add this temporary block right before your employees query:
try {
    // 1. Check if ANY user has an object stored in their role field
    const corruptedUsers = await userModel.find({ role: { $type: "object" } });
    if (corruptedUsers.length > 0) {
        console.log("FOUND CORRUPTED DOCUMENTS IN DB:", corruptedUsers);
    }
} catch (dbErr) {
    console.error("Debug check failed:", dbErr);
}



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