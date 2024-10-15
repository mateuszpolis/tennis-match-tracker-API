import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { UserRole, UserStatus } from "../models/User";
import crypto from "crypto";
import { Op } from "sequelize";
import MailService from "../services/mailService";
import AuthService from "../services/authService";
import { env } from "process";

class AuthRouter {
  public router = express.Router();
  private mailService: MailService;
  private authService: AuthService;

  constructor(mailService: MailService, authService: AuthService) {
    dotenv.config();
    this.mailService = mailService;
    this.authService = authService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", this.register);
    this.router.post("/login", this.login);
    this.router.post("/logout", this.logout);
    this.router.post("/confirm", this.confirmEmail);
    this.router.post("/forgot-password", this.forgotPassword);
    this.router.post("/reset-password", this.resetPassword);
    this.router.get(
      "/details",
      this.authService.isAuthenticated,
      this.getUserDetails
    );
  }

  private forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res
          .status(400)
          .json({ message: "No user found with that email" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000);
      await user.save();

      this.mailService.sendResetPasswordEmail(email, resetToken);

      res.status(200).json({ message: "Password reset email sent" });
    } catch (err: any) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  private resetPassword = async (req: Request, res: Response): Promise<any> => {
    const { token, newPassword } = req.body;

    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: new Date() },
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      this.mailService.sendPasswordChangedEmail(user.email);

      res.status(200).json({ message: "Password has been reset" });
    } catch (err: any) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  private async confirmEmail(req: Request, res: Response): Promise<any> {
    const { token } = req.body;

    try {
      const user = await User.findOne({
        where: { confirmationToken: token as string },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      user.status = UserStatus.Active;
      user.confirmationToken = null;
      await user.save();

      res.status(200).json({ message: "Email confirmed successfully" });
    } catch (err: any) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }

  private register = async (req: Request, res: Response): Promise<any> => {
    const { name, surname, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const confirmationToken = crypto.randomBytes(32).toString("hex");

      await User.create({
        name,
        surname,
        email,
        password: hashedPassword,
        role: UserRole.User,
        status: UserStatus.Inactive,
        confirmationToken,
      });

      this.mailService.sendConfirmationEmail(email, confirmationToken);

      res.status(201).json({ message: "User registered successfully" });
    } catch (err: any) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  private login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const payload = { user: user };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });

      res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  private logout = (req: Request, res: Response): any => {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  };

  private getUserDetails = (req: Request, res: Response): any => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ user });
  };
}

export default AuthRouter;
