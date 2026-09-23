function authorizeRoles(
  ...allowedRoles
) {
  return (
    req,
    res,
    next
  ) => {
    if (!req.user) {
      return res
        .status(401)
        .json({
          message:
            "User is not authenticated",
        });
    }

    const userRole =
      req.user.role;

    if (
      !userRole ||
      !allowedRoles.includes(
        userRole
      )
    ) {
      return res
        .status(403)
        .json({
          message:
            "You do not have permission to access this resource",
        });
    }

    next();
  };
}

module.exports =
  authorizeRoles;