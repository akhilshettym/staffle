import taskModel from "../../models/task.model.js";
import userModel from "../../models/user.model.js";

export const reviewTaskRejectionController = async (req, res) => {
    
    try {
        const { taskId } = req.params;
        const { decision, adminReason, reassignTo } = req.body;
        const loggedInUser = req.user;

        if (loggedInUser.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Only admin can review rejection"
            });
        }

        if (!["APPROVED", "REJECTED"].includes(decision)) {
            return res.status(400).json({ success: false, message: "Decision must be APPROVED or REJECTED" });
        }

        const task = await taskModel.findOne({
            _id: taskId,
            organizationId: loggedInUser.organizationId
        });

        if (!task || task.status !== "REJECTION_REQUESTED") {
            return res.status(400).json({
                success: false,
                message: "No rejection pending for this task"
            });
        }

        if (decision === "APPROVED") {

            task.rejection.status = "APPROVED";

            if (reassignTo) {
                const employee = await userModel.findOne({
                    _id: reassignTo,
                    organizationId: loggedInUser.organizationId,
                    role: "EMPLOYEE",
                    employmentStatus: "ACTIVE",
                });
                if (!employee) {
                    return res.status(400).json({ success: false, message: "Reassignment requires an active organization employee" });
                }
                task.assignedTo = reassignTo;
                task.status = "NEW";
            } else {
                task.status = "FAILED";
            }

        } else if (decision === "REJECTED") {

            if (typeof adminReason !== "string" || adminReason.trim().length < 10) {
                return res.status(400).json({
                    success: false,
                    message: "Admin reason required"
                });
            }

            task.rejection.status = "REJECTED";
            task.rejection.adminReason = adminReason.trim();

            task.status = "NEW";
        }

        task.rejection.reviewedBy = loggedInUser._id;
        task.rejection.reviewedAt = new Date();

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Rejection reviewed successfully",
            task
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error reviewing rejection",
        });
    }
};
