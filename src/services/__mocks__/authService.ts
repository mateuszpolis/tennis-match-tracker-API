export default class AuthService {
  isAuthenticated = jest.fn((req, res, next) => {
    console.log("isAuthenticated called");
    const token = req.cookies.jwt;

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = { id: 1, email: "john.doe@example.com", role: "Admin" };
    next();
  });

  hasRole(roles: any[]): any {
    return (req: any, res: any, next: any) => {
      console.log("hasRole called with roles:", roles);
      console.log("User role:", req.user.role);
      if (!roles.includes(req.user.role)) {
        console.log("User does not have required role");
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }
      console.log("User has required role");
      next();
      console.log("hasRole finished");
    };
  }
}
