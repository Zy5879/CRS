"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizeAdminStaffPermissions = (req, res, next) => {
    const user = req.body;
    if (!user || !user.role) {
        res.status(401).json({ error: "Access Denied" });
        return;
    }
    if (user && (user.role === "ADMIN" || user.role === "STAFF")) {
        next();
        return;
    }
    return res.status(403).json({ error: "Access Denied" });
};
module.exports = authorizeAdminStaffPermissions;
