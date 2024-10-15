import express from "express";
import jwt from "jsonwebtoken";
import User, { UserRole } from "../models/User";

export default class AuthService {
  public isAuthenticated = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<any> => {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      const userId = (decoded as jwt.JwtPayload).user.id;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };

  public hasRole = (roles: UserRole[]): any => {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (!roles.includes((req.user as User).role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }
      next();
    };
  };
}
