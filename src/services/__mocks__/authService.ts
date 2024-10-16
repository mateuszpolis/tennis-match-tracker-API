export default class AuthService {
  isAuthenticated = jest.fn((req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = { id: 1, email: "john.doe@example.com", role: "Admin" };
    next();
  });

  hasRole(roles: any[]): any {
    return (req: any, res: any, next: any) => {
      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }
      next();
    };
  }
}
