/**
 * Authorization helper — simulates role-based access control.
 * In production, this would validate JWT tokens and user roles.
 * 
 * Roles: 'admin' (full access), 'mechanic' (read + update), 'receptionist' (create + read)
 */

const PERMISSIONS = {
  admin:        ['create', 'read', 'update', 'delete', 'stats'],
  mechanic:     ['read', 'update', 'stats'],
  receptionist: ['create', 'read', 'stats'],
};

/**
 * Authorization middleware factory.
 * Usage: router.delete('/:id', authorize('delete'), handler)
 */
const authorize = (action) => (req, res, next) => {
  // In production: decode JWT from req.headers.authorization
  // For this demo, role comes from x-user-role header (simulated)
  const role = req.headers['x-user-role'] || 'admin';

  if (!PERMISSIONS[role]) {
    return res.status(403).json({
      success: false,
      message: `Unknown role: ${role}`,
    });
  }

  if (!PERMISSIONS[role].includes(action)) {
    console.log(`[Auth] DENIED: role=${role} attempted action=${action}`);
    return res.status(403).json({
      success: false,
      message: `Access denied. Role '${role}' cannot perform '${action}'.`,
    });
  }

  console.log(`[Auth] ALLOWED: role=${role} action=${action}`);
  next();
};

module.exports = { authorize, PERMISSIONS };
