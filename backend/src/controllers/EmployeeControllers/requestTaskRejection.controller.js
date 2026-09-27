import taskModel from "../../models/task.model.js";

export const requestTaskRejectionController = async (req, res) => {

    try {
        const { taskId } = req.params;
        const { reason } = req.body;
        const loggedInUser = req.user;

        if (typeof reason !== "string" || reason.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required (min 10 characters)"
            });
        }

        const task = await taskModel.findOne({
            _id: taskId,
            organizationId: loggedInUser.organizationId
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        if (task.assignedTo.toString() !== loggedInUser._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        if (task.status !== "NEW") {
            return res.status(400).json({
                success: false,
                message: "Only NEW tasks can be rejected"
            });
        }

        task.status = "REJECTION_REQUESTED";

        task.rejection = {
            requestedBy: loggedInUser._id,
            reason: reason.trim(),
            requestedAt: new Date(),
            status: "PENDING"
        };

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Rejection request submitted to admin",
            task
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error requesting rejection",
        });
    }
};
