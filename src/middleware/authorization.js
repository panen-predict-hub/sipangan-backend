const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized: No role information found',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden: Anda tidak memiliki akses untuk aksi ini',
      });
    }

    next();
  };
};

export default authorizeRoles;
