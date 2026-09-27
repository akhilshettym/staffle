export const requireSuperAdmin = (req, res, next) => {

    if (req.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Only Super Admin can perform this action",
        });
    };
    next();
};

export const requireAdmin = (req, res, next) => {

    if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Only Admin or Super Admin can perform this action",
        });
    };
    next();
};

export const requireEmployee = (req, res, next) => {

    if (req.user.role !== "EMPLOYEE") {
        return res.status(403).json({
            success: false,
            message: "Only Employees can perform this action",
        })
    };
    next();
}

export const requireOrgUser = (req, res, next) => {

    if (req.user.role === "SUPER_ADMIN" || req.user.role === "ADMIN" || req.user.role === "EMPLOYEE") {
        return res.status(403).json({
            success: false,
            message: "Only Org users can login",
        });
    };
    next();
}
