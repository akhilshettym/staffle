import taskModel from "../../models/task.model.js";

export const getTaskDetailsController = async (req, res) => {

    try {
        const organizationId = req.user.organizationId;

        const query = req.user.role === "EMPLOYEE"
            ? { organizationId, assignedTo: req.user._id }
            : { organizationId };
        const tasks = await taskModel.find(query)
            .select("title category priority assignedTo description organizationId dueDate status createdAt rejection taskLifeCycle")
            .sort({ createdAt: 1 });
        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch task details"
        });
    }
};
