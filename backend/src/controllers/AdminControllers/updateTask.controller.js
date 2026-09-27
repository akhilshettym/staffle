import mongoose from "mongoose";
import taskModel from "../../models/task.model.js";
import userModel from "../../models/user.model.js";

export const updateTaskController = async (req, res) => {

  try {
    const { taskId } = req.params;
    const loggedInUser = req.user;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const { title, category, description, assignedTo, dueDate, priority } = req.body;

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

    if (
      task.organizationId.toString() !== loggedInUser.organizationId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot update tasks from another organization",
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
      if (!assignedUser) {
        return res
          .status(404)
          .json({ success: false, message: "Assigned user not found" });
      }
      if (
        assignedUser.organizationId.toString() !==
        loggedInUser.organizationId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "Assigned user does not belong to your organization",
        });
      }
      if (assignedUser.role !== "EMPLOYEE" || assignedUser.employmentStatus !== "ACTIVE") {
        return res.status(400).json({ success: false, message: "Assigned user must be an active employee" });
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
        return res
          .status(400)
          .json({ success: false, message: "Invalid due date format" });
      }

      const now = new Date();
      if (parsedDate <= now) {
        return res.status(400).json({
          success: false,
          message: "Cannot update task: due date is in the past. Please provide a valid due date.",
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
      message: "Task updated successfully",
      task,
    });
    
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating the task",
    });
  }
};
