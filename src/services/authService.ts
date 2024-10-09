import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export default class AuthService {
  public isAuthenticated(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): any {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, "your_jwt_secret");
      req.user = (decoded as jwt.JwtPayload).user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  static hasRole(role: string) {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if ((req.user as User).role !== role) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }
      next();
    };
  }
}
