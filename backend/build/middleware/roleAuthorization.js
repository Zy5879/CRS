"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizeAdminStaffPermissions = (req, res, next) => {
    const user = req.body;
    if (!user || !user.role) {
        res.status(401).json({ error: "Access Denied" });
    }
    if (user && (user.role === "ADMIN" || user.role === "CUSTOMER")) {
        res.json(user);
        return;
    }
    return res.status(403).json({ error: "Access Denied" });
};
module.exports = authorizeAdminStaffPermissions;
