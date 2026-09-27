import express from "express";
import { PERMISSIONS } from "../constants/permissions.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { requireEmployee } from "../middleware/role.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { acceptTaskController } from "../controllers/EmployeeControllers/acceptTask.controller.js";
import { getOrganizationUsers } from "../controllers/EmployeeControllers/getOrgUsers.controller.js";
import { updateEmployeeController } from "../controllers/AdminControllers/updateEmployee.controller.js";
import { markTaskAsFailedController } from "../controllers/EmployeeControllers/markTaskAsFailed.controller.js";
import { getOrganizationInactiveUsers } from "../controllers/EmployeeControllers/getOrgInactiveUsers.controller.js";
import { markTaskAsCompletedController } from "../controllers/EmployeeControllers/markTaskAsCompleted.controller.js";
import { requestTaskRejectionController } from "../controllers/EmployeeControllers/requestTaskRejection.controller.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { validateObjectIdParams } from "../middleware/security.middleware.js";

const router = express.Router();

/* PATCH /api/employee/tasks/accept-task/:taskId */
router.patch("/tasks/accept-task/:taskId", validateObjectIdParams("taskId"), authMiddleware, requireEmployee, requirePermission(PERMISSIONS.ACCEPT_TASK), acceptTaskController);

/* PATCH /api/employee/tasks/reject-task/:taskId */
router.patch("/tasks/reject-task/:taskId", validateObjectIdParams("taskId"), authMiddleware, requireEmployee, requirePermission(PERMISSIONS.REQUEST_REJECT_TASK), requestTaskRejectionController);

/* PATCH /api/employee/tasks/mark-as-completed/:taskId */
router.patch("/tasks/mark-as-completed/:taskId", validateObjectIdParams("taskId"), authMiddleware, requireEmployee, requirePermission(PERMISSIONS.MARK_AS_COMPLETED), markTaskAsCompletedController);

/* PATCH /api/employee/tasks/mark-as-failed/:taskId */
router.patch("/tasks/mark-as-failed/:taskId", validateObjectIdParams("taskId"), authMiddleware, requireEmployee, requirePermission(PERMISSIONS.MARK_AS_FAILED), markTaskAsFailedController);

/* PATCH /api/employee/update-employee/:employeeId */
router.patch("/update-employee/:employeeId", validateObjectIdParams("employeeId"), authMiddleware, requirePermission(PERMISSIONS.UPDATE_EMPLOYEE), updateEmployeeController);

/* GET /api/employee/get-employees */
router.get("/get-employees", authMiddleware, requireAdmin, requirePermission(PERMISSIONS.VIEW_EMPLOYEES), getOrganizationUsers);

/* GET /api/employee/get-inactive-employees */
router.get("/get-inactive-employees", authMiddleware, requireAdmin, requirePermission(PERMISSIONS.VIEW_EMPLOYEES), getOrganizationInactiveUsers);


export default router;
