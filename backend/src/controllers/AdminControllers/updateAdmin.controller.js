import userModel from "../../models/user.model.js";

export const updateAdminController = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { adminId } = req.params;
        const { firstName, lastName, email, dateOfBirth, designation } = req.body;

        let adminToUpdate;

        if (loggedInUser.role === "SUPER_ADMIN" && adminId) {
            adminToUpdate = await userModel.findById(adminId);
        } else {
            adminToUpdate = await userModel.findById(loggedInUser._id);
        }

        if (!adminToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        if (adminToUpdate.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Only admin accounts can be updated" });
        }

        if (adminToUpdate.employmentStatus !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Only active admin details can be updated",
            });
        }

        if (firstName === undefined && lastName === undefined && email === undefined && designation === undefined && dateOfBirth === undefined) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update",
            });
        }

        if (typeof email === "string" && email.toLowerCase() !== adminToUpdate.email) {
            const normalizedEmail = email.trim().toLowerCase();
            const existingEmail = await userModel.findOne({ email: normalizedEmail });
            if (existingEmail && existingEmail._id.toString() !== adminToUpdate._id.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use",
                });
            }
            adminToUpdate.email = normalizedEmail;
        }

        if (firstName !== undefined) adminToUpdate.firstName = firstName;
        if (lastName !== undefined) adminToUpdate.lastName = lastName;
        if (designation !== undefined) adminToUpdate.designation = designation;

        if (dateOfBirth !== undefined) {
            const parsedDate = new Date(dateOfBirth);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid DOB format",
                });
            }
            adminToUpdate.dateOfBirth = parsedDate;
        }

        await adminToUpdate.save();

        return res.status(200).json({
            success: true,
            message: "Admin details updated successfully",
            admin: adminToUpdate,
        });

    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({
                success: false,
                message: "Email already in use",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error updating admin details",
        });
    }
};
