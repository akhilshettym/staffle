import taskModel from "../../models/task.model.js";
import userModel from "../../models/user.model.js";
import orgModel from "../../models/org.model.js";

export const updateNewTaskController = async (req, res) => {
  try {
    const { orgId, taskId } = req.params;

    const {
      title,
      category,
      description,
      assignedTo,
      dueDate,
      priority,
    } = req.body;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    const organization = await orgModel.findById(orgId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (organization.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Organization is not active",
      });
    }

    const task = await taskModel.findOne({
      _id: taskId,
      organizationId: orgId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found for this organization",
      });
    }

    if (task.status !== "NEW" && task.status !== "FAILED") {
      return res.status(400).json({
        success: false,
        message: "Only tasks with NEW and FAILED status can be updated",
      });
    }

    if (assignedTo) {
      const assignedUser = await userModel.findById(assignedTo);

      if (!assignedUser || assignedUser.role !== "EMPLOYEE" || assignedUser.employmentStatus !== "ACTIVE") {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found",
        });
      }

      if (assignedUser.organizationId.toString() !== orgId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Assigned user does not belong to selected organization",
        });
      }

      task.assignedTo = assignedTo;
    }

    if (title !== undefined) task.title = title;
    if (category !== undefined) task.category = category;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;

    if (dueDate !== undefined && dueDate !== null && dueDate !== "") {
      const parsedDate = new Date(dueDate);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid due date format",
        });
      }

      const now = new Date();

      if (parsedDate <= now) {
        return res.status(400).json({
          success: false,
          message: "Cannot update task: due date is in the past",
        });
      }

      task.dueDate = parsedDate;
    }

    if (task.status === "FAILED") {
      task.status = "NEW";

      if (task.taskLifeCycle?.failure) {
        task.taskLifeCycle.failure.reason = undefined;
        task.taskLifeCycle.failure.failedBy = undefined;
        task.taskLifeCycle.failure.failedAt = undefined;
      }
    }

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully (SUPER ADMIN)",
      task,
    });

  } catch (error) {
    console.error("Error updating task (SUPER ADMIN):", error);

    return res.status(500).json({
      success: false,
      message: "Error updating the task",
    });
  }
};
