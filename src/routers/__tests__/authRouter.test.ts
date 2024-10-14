import request from "supertest";
import express from "express";
import AuthRouter from "../authRouter";
import MailService from "../../services/mailService";
import User from "../../models/User";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import AuthService from "../../services/__mocks__/authService";
import cookieParser from "cookie-parser";

jest.mock("../../models/User");
jest.mock("../../services/mailService");
jest.mock("../../services/authService");

const app = express();
app.use(express.json());
app.use(cookieParser());

const mailService = new MailService();
const authService = new AuthService();
const authRouter = new AuthRouter(mailService, authService as any);
app.use("/auth", authRouter.router);

describe("AuthRouter", () => {
  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({});
      mailService.sendConfirmationEmail = jest.fn();

      const response = await request(app).post("/auth/register").send({
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
      expect(mailService.sendConfirmationEmail).toHaveBeenCalled();
    });

    it("should return 400 if email is already in use", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({});

      const response = await request(app).post("/auth/register").send({
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email already in use");
    });
  });

  describe("POST /auth/login", () => {
    it("should login a user", async () => {
      const user = {
        id: 1,
        email: "john.doe@example.com",
        password: "hashedpassword",
      };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("token");

      const response = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logged in successfully");
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should return 401 if email or password is invalid", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
    });
  });

  describe("POST /auth/forgot-password", () => {
    it("should send a password reset email", async () => {
      const user = { id: 1, email: "john.doe@example.com", save: jest.fn() };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      mailService.sendResetPasswordEmail = jest.fn();

      const response = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "john.doe@example.com" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password reset email sent");
      expect(mailService.sendResetPasswordEmail).toHaveBeenCalled();
    });

    it("should return 400 if no user found with that email", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "john.doe@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("No user found with that email");
    });
  });

  describe("POST /auth/reset-password", () => {
    it("should reset the password", async () => {
      const user = { id: 1, email: "john.doe@example.com", save: jest.fn() };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedpassword");
      mailService.sendPasswordChangedEmail = jest.fn();

      const response = await request(app)
        .post("/auth/reset-password")
        .send({ token: "validtoken", newPassword: "newpassword123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password has been reset");
      expect(mailService.sendPasswordChangedEmail).toHaveBeenCalled();
    });

    it("should return 400 if token is invalid or expired", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/reset-password")
        .send({ token: "invalidtoken", newPassword: "newpassword123" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid or expired token");
    });
  });

  describe("POST /auth/confirm", () => {
    it("should confirm the email", async () => {
      const user = { id: 1, email: "john.doe@example.com", save: jest.fn() };
      (User.findOne as jest.Mock).mockResolvedValue(user);

      const response = await request(app)
        .post("/auth/confirm")
        .send({ token: "validtoken" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Email confirmed successfully");
    });

    it("should return 400 if token is invalid or expired", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/confirm")
        .send({ token: "invalidtoken" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid or expired token");
    });
  });

  describe("POST /auth/logout", () => {
    it("should logout the user", async () => {
      const response = await request(app).post("/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logged out successfully");
    });
  });

  describe("GET /auth/details", () => {
    it("should return user details if authenticated", async () => {
      const user = { id: 1, email: "john.doe@example.com", role: "Admin" };
      authService.isAuthenticated = jest.fn((req, res, next) => {
        req.user = user;
        next();
      }) as unknown as AuthService["isAuthenticated"];

      const response = await request(app)
        .get("/auth/details")
        .set("Cookie", "jwt=validtoken");

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(user);
    });

    it("should return 401 if not authenticated", async () => {
      authService.isAuthenticated = jest.fn((req, res, next) => {
        next();
      }) as unknown as AuthService["isAuthenticated"];

      const response = await request(app).get("/auth/details");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
  });
});
