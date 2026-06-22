import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}

export function authAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const token = header.slice(7);
    req.admin = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requirePermission(...perms) {
  return (req, res, next) => {
    const userPerms = req.admin?.permissions || [];
    if (userPerms.includes("*") || perms.some((p) => userPerms.includes(p))) {
      return next();
    }
    return res.status(403).json({ error: "Insufficient permissions" });
  };
}

export async function attachAdminPermissions(req, _res, next) {
  if (req.admin?.id) {
    const admin = await Admin.findById(req.admin.id).populate("roleId");
    if (admin?.roleId?.permissions) {
      req.admin.permissions = admin.roleId.permissions;
    }
  }
  next();
}
