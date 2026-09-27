import crypto from "node:crypto";
import orgModel from "../../models/org.model.js";
import taskModel from "../../models/task.model.js";
import userModel from "../../models/user.model.js";

export const createTaskController = async (req, res) => {
  try {
    const { title, category, description, assignedTo, dueDate, priority } =
      req.body;

    const loggedInUser = req.user;

    if (![title, category, description, assignedTo, dueDate, priority].every(Boolean)) {
      return res.status(400).json({ success: false, message: "All task fields are required" });
    }

    const parsedDueDate = new Date(dueDate);
    if (Number.isNaN(parsedDueDate.getTime()) || parsedDueDate <= new Date()) {
      return res.status(400).json({ success: false, message: "Due date must be in the future" });
    }

    const organization = await orgModel.findById(loggedInUser.organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (organization.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Organization is not active",
      });
    }

    const assignedUser = await userModel.findById(assignedTo);

    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }

    if (
      assignedUser.organizationId.toString() !==
      loggedInUser.organizationId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "User does not belong to your organization",
      });
    }

    if (assignedUser.role !== "EMPLOYEE" || assignedUser.employmentStatus !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Employee is inactive",
      });
    }

    const task = await taskModel.create({
      uuid: crypto.randomUUID(),
      title,
      category,
      description,
      organizationId: loggedInUser.organizationId,
      assignedTo,
      dueDate: parsedDueDate,
      priority,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("TASK CREATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating the task",
    });
  }
};
