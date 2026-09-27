import taskModel from "../../models/task.model.js";

export const markTaskAsCompletedController = async (req, res) => {

    try {
        const { taskId } = req.params;
        const loggedInUser = req.user;

        const task = await taskModel.findOne({
            _id: taskId,
            organizationId: loggedInUser.organizationId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        if (task.assignedTo.toString() !== loggedInUser._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to complete this task",
            });
        }

        if (task.status !== "IN_PROGRESS") {
            return res.status(400).json({
                success: false,
                message: "Only tasks IN_PROGRESS can be marked as COMPLETED",
            });
        }

        task.status = "COMPLETED";

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task moved to COMPLETED",
            task,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error marking the task as completed",
        });
    }
};
