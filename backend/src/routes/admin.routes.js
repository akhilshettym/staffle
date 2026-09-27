import express from "express";
import { PERMISSIONS } from "../constants/permissions.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { createTaskController } from "../controllers/AdminControllers/createTask.controller.js";
import { updateTaskController } from "../controllers/AdminControllers/updateTask.controller.js";
import { deleteTaskController } from "../controllers/AdminControllers/deleteTask.controller.js";
import { updateAdminController } from "../controllers/AdminControllers/updateAdmin.controller.js";
import { addEmployeeController } from "../controllers/AdminControllers/addEmployee.controller.js";
import { deactivateEmployeeController } from "../controllers/AdminControllers/deactivateEmployee.controller.js";
import { reactivateEmployeeController } from "../controllers/AdminControllers/reactivateEmployee.controller.js";
import { reviewTaskRejectionController } from "../controllers/AdminControllers/reviewTaskRejection.controller.js";
import { validateObjectIdParams } from "../middleware/security.middleware.js";

const router = express.Router();

/* POST /api/admin/add-employee */
router.post("/add-employee", authMiddleware, requireAdmin, requirePermission(PERMISSIONS.CREATE_EMPLOYEE), addEmployeeController);

/* PATCH /api/admin/deactivate-employee/:empId */
router.patch("/deactivate-employee/:empId", validateObjectIdParams("empId"), authMiddleware, requireAdmin, requirePermission(PERMISSIONS.DEACTIVATE_EMPLOYEE), deactivateEmployeeController);

/* PATCH /api/admin/reactivate-employee/:empId */
router.patch("/reactivate-employee/:empId", validateObjectIdParams("empId"), authMiddleware, requireAdmin, requirePermission(PERMISSIONS.REACTIVATE_EMPLOYEE), reactivateEmployeeController);

/* PATCH /api/admin/update-admin/:adminId */
router.patch("/update-admin/:adminId", validateObjectIdParams("adminId"), authMiddleware, requireAdmin, requirePermission(PERMISSIONS.UPDATE_ADMIN), updateAdminController);

/* PATCH /api/admin/tasks/review-task-rejection/:taskId */
router.patch("/tasks/review-task-rejection/:taskId", validateObjectIdParams("taskId"), authMiddleware, requireAdmin, requirePermission(PERMISSIONS.REVIEW_REJECT_TASK), reviewTaskRejectionController);

/* POST /api/admin/tasks/create-task */
router.post("/tasks/create-task", authMiddleware, requireAdmin, requirePermission(PERMISSIONS.CREATE_TASK), createTaskController);

/* PATCH /api/admin/tasks/update-task/:taskId */
router.patch("/tasks/update-task/:taskId", validateObjectIdParams("taskId"), authMiddleware, requireAdmin, requirePermission(PERMISSIONS.UPDATE_TASK), updateTaskController);

/* DELETE /api/admin/tasks/delete-task/:taskId */
router.delete("/tasks/delete-task/:taskId", validateObjectIdParams("taskId"), authMiddleware, requireAdmin, requirePermission(PERMISSIONS.DELETE_TASK), deleteTaskController);

export default router;
