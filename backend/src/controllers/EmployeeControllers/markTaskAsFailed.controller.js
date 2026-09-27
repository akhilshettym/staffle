import taskModel from "../../models/task.model.js";

export const markTaskAsFailedController = async (req, res) => {

    try {
        const { taskId } = req.params;
        const { reason } = req.body;
        const loggedInUser = req.user;

        if (typeof reason !== "string" || reason.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Failure reason is required (min 10 characters)"
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
                message: "You are not authorized to mark this task as failed"
            });
        }

        if (task.status !== "IN_PROGRESS") {
            return res.status(400).json({
                success: false,
                message: "Only IN_PROGRESS tasks can be marked as FAILED"
            });
        }

        task.status = "FAILED";

        task.taskLifeCycle.failure = {
            reason: reason.trim(),
            failedBy: loggedInUser._id,
        };

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task marked as FAILED",
            task
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error marking task as failed",
        });
    }
};
