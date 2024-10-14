import request from "supertest";
import express from "express";
import UserRouter from "../userRouter";
import AuthService from "../../services/authService";
import UserService from "../../services/userService";

const mockAuthService = {
  isAuthenticated: jest.fn((req, res, next) => next()),
} as unknown as AuthService as any;

const mockUserService = {
  getRanking: jest.fn(),
  getUserById: jest.fn(),
  getPlayerInfo: jest.fn(),
  getUsersByQuery: jest.fn(),
} as unknown as UserService as any;

const app = express();
const userRouter = new UserRouter(mockAuthService, mockUserService);
app.use("/users", userRouter.router);

describe("UserRouter", () => {
  describe("GET /users/ranking", () => {
    it("should return user ranking", async () => {
      const ranking = [{ id: 1, score: 100 }];
      mockUserService.getRanking.mockResolvedValue(ranking);

      const response = await request(app).get("/users/ranking");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(ranking);
    });

    it("should handle server error", async () => {
      mockUserService.getRanking.mockRejectedValue(new Error("Server error"));

      const response = await request(app).get("/users/ranking");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error", error: "Server error" });
    });
  });

  describe("GET /users/profile/:id", () => {
    it("should return user profile with player info", async () => {
      const user = { id: 1, name: "John Doe", toJSON: jest.fn().mockReturnValue({ id: 1, name: "John Doe" }) };
      const playerInfo = { level: 10, experience: 2000 };
      mockUserService.getUserById.mockResolvedValue(user);
      mockUserService.getPlayerInfo.mockResolvedValue(playerInfo);

      const response = await request(app).get("/users/profile/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, name: "John Doe", playerInfo });
    });

    it("should return 404 if user not found", async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      const response = await request(app).get("/users/profile/1");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "User not found" });
    });

    it("should handle server error", async () => {
      mockUserService.getUserById.mockRejectedValue(new Error("Server error"));

      const response = await request(app).get("/users/profile/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error", error: "Server error" });
    });
  });

  describe("GET /users/one/:id", () => {
    it("should return user by id", async () => {
      const user = { id: 1, name: "John Doe" };
      mockUserService.getUserById.mockResolvedValue(user);

      const response = await request(app).get("/users/one/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
    });

    it("should return 404 if user not found", async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      const response = await request(app).get("/users/one/1");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "User not found" });
    });

    it("should handle server error", async () => {
      mockUserService.getUserById.mockRejectedValue(new Error("Server error"));

      const response = await request(app).get("/users/one/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error", error: "Server error" });
    });
  });

  describe("GET /users/search", () => {
    it("should return users by query", async () => {
      const users = [{ id: 1, name: "John Doe" }];
      mockUserService.getUsersByQuery.mockResolvedValue(users);

      const response = await request(app).get("/users/search?query=John");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(users);
    });

    it("should handle server error", async () => {
      mockUserService.getUsersByQuery.mockRejectedValue(new Error("Server error"));

      const response = await request(app).get("/users/search?query=John");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server error", error: "Server error" });
    });
  });
});