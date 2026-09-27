import mongoose from "mongoose";
import taskModel from "../../models/task.model.js";

export const deleteTaskController = async (req, res) => {
    
  try {
    const { taskId } = req.params;
    const loggedInUser = req.user;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you are not authorized to delete it",
      });
    }

    const deletedTask = await taskModel.findOneAndDelete({
      _id: taskId,
      organizationId: loggedInUser.organizationId,
    });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you are not authorized to delete it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      deletedTask,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting the task",
    });
  }
};
