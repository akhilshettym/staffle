import userModel from "../../models/user.model.js";

export const updateEmployeeController = async (req, res) => {

    try {
        const { employeeId } = req.params;
        const loggedInUser = req.user;

        const { firstName, lastName, email, dateOfBirth, designation } = req.body;

        if (loggedInUser.role === "EMPLOYEE" && loggedInUser._id.toString() !== employeeId) {
            return res.status(403).json({ success: false, message: "You can only update your own profile" });
        }
        
        const query =
            loggedInUser.role === "SUPER_ADMIN"
                ? { _id: employeeId }
                : { _id: employeeId, organizationId: loggedInUser.organizationId };

        const employee = await userModel.findOne(query);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        if (employee.role !== "EMPLOYEE") {
            return res.status(403).json({
                success: false,
                message: "Only employees can be updated",
            });
        }

        if (employee.employmentStatus !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Only active employee details can be updated",
            });
        }

        if (
            firstName === undefined &&
            lastName === undefined &&
            email === undefined &&
            designation === undefined &&
            dateOfBirth === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update",
            });
        }

        // email check
        if (typeof email === "string" && email.toLowerCase() !== employee.email) {
            const normalizedEmail = email.trim().toLowerCase();
            const existingEmail = await userModel.findOne({ email: normalizedEmail });

            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use",
                });
            }

            employee.email = normalizedEmail;
        }

        if (firstName !== undefined) employee.firstName = firstName;
        if (lastName !== undefined) employee.lastName = lastName;
        if (designation !== undefined) employee.designation = designation;

        if (dateOfBirth !== undefined) {
            const parsedDate = new Date(dateOfBirth);

            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid DOB format",
                });
            }

            employee.dateOfBirth = parsedDate;
        }

        await employee.save();

        return res.status(200).json({
            success: true,
            message: "Employee details updated successfully",
            employee,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating employee details",
        });
    }
};
