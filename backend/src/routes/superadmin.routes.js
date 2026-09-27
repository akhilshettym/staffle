import express from "express";
import { PERMISSIONS } from "../constants/permissions.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { requireSuperAdmin } from "../middleware/role.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { addAdminController } from "../controllers/SuperAdminControllers/addAdmin.controller.js";
import { getAllTasksDetails } from "../controllers/SuperAdminControllers/getAllTasks.controller.js";
import { updateNewTaskController } from "../controllers/SuperAdminControllers/updateNewTask.controller.js";
import { createNewTaskController } from "../controllers/SuperAdminControllers/createNewTask.controller.js";
import { rejectOrganization } from "../controllers/SuperAdminControllers/rejectOrganization.controller.js";
import { revokeOrganization } from "../controllers/SuperAdminControllers/revokeOrganization.controller.js";
import { getAllEmployeesDetails } from "../controllers/SuperAdminControllers/getAllEmployees.controller.js";
import { approveOrganization } from "../controllers/SuperAdminControllers/approveOrganization.controller.js";
import { getAllOrganizationDetails } from "../controllers/SuperAdminControllers/getAllOrganization.controller.js";
import { reactivateOrganization } from "../controllers/SuperAdminControllers/reactivateOrganization.controller.js";
import { getOrgSpecificTasksDetails } from "../controllers/SuperAdminControllers/getSpecificOrgTasks.controller.js";
import { deleteOrganizationController } from "../controllers/SuperAdminControllers/deleteOrganization.controller.js";
import { deleteAdminEmployeeController } from "../controllers/SuperAdminControllers/deleteAdminEmployee.controller.js";
import { getOrgSpecificEmployeeDetails } from "../controllers/SuperAdminControllers/getSpecificOrgEmployees.controller.js";
import { getSpecificOrganizationDetails } from "../controllers/SuperAdminControllers/getSpecificOrganization.controller.js";
import { validateObjectIdParams } from "../middleware/security.middleware.js";

const router = express.Router();

/* GET /api/superadmin/get-all-organization-details */
router.get("/get-all-organizations-details", authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.VIEW_ALL_ORGANIZATIONS), getAllOrganizationDetails);

/* GET /api/superadmin/get-all-employees-details */
router.get("/get-all-employees-details", authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.VIEW_ALL_EMPLOYEES), getAllEmployeesDetails);

/* GET /api/superadmin/get-all-tasks-details */
router.get("/get-all-tasks-details", authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.VIEW_ALL_TASKS), getAllTasksDetails);

/* PATCH /api/superadmin/approve-organization/:orgId */
router.patch("/approve-organization/:orgId", validateObjectIdParams("orgId"), authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.APPROVE_ORGANIZATION), approveOrganization);

/* PATCH /api/superadmin/reject-organization/:orgId */
router.patch("/reject-organization/:orgId", validateObjectIdParams("orgId"), authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.REJECT_ORGANIZATION), rejectOrganization);

/* PATCH /api/superadmin/revoke-organization/:orgId */
router.patch("/revoke-organization/:orgId", validateObjectIdParams("orgId"), authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.REVOKE_ORGANIZATION), revokeOrganization);

/* PATCH /api/superadmin/re-activate-organization/:orgId */
router.patch("/re-activate-organization/:orgId", validateObjectIdParams("orgId"), authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.RE_ACTIVATE_ORGANIZATION), reactivateOrganization);

/* DELETE /api/superadmin/delete-rejected-organization/:orgId */
router.delete("/delete-rejected-organization/:orgId", validateObjectIdParams("orgId"), authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.DELETE_ORGANIZATION), deleteOrganizationController);

/* GET /api/superadmin/get-specific-organization-details/:orgId */
router.get("/get-specific-organization-details/:orgId", validateObjectIdParams("orgId"), authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.VIEW_ALL_ORGANIZATIONS), getSpecificOrganizationDetails);

/* GET /api/superadmin/get-specific-employees-details/:orgId */
router.get("/get-org-specific-employees/:orgId", validateObjectIdParams("orgId"), authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.VIEW_ALL_EMPLOYEES), getOrgSpecificEmployeeDetails);

/* GET /api/superadmin/get-specific-tasks-details/:orgId */
router.get("/get-org-specific-tasks/:orgId", validateObjectIdParams("orgId"), authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.VIEW_ALL_TASKS), getOrgSpecificTasksDetails);

/* POST /api/superadmin/add-admin */
router.post("/add-admin", authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.CREATE_ADMIN), addAdminController);

/* DELETE /api/superadmin/delete-admin-employee/:empId */
router.delete("/delete-admin-employee/:empId", validateObjectIdParams("empId"), authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.DELETE_ADMIN_EMPLOYEE), deleteAdminEmployeeController);

/* POST /api/superadmin/create-tasks/:taskId */
router.post("/create-tasks/:orgId", validateObjectIdParams("orgId"), authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.CREATE_TASK), createNewTaskController);

/* PATCH /api/superadmin/tasks/update-task/:taskId */
router.patch("/update-task/org/:orgId/task/:taskId", validateObjectIdParams("orgId", "taskId"), authMiddleware, requireSuperAdmin, requirePermission(PERMISSIONS.UPDATE_TASK), updateNewTaskController);

export default router;
