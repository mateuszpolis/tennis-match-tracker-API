import request from "supertest";
import express from "express";
import MatchRouter from "../matchRouter";
import AuthService from "../../services/__mocks__/authService";
import cookieParser from "cookie-parser";
import MatchService from "../../services/__mocks__/matchService";
import TournamentService from "../../services/__mocks__/tournamentService";

jest.mock("../../services/groundService");
jest.mock("../../services/authService");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authService = new AuthService();
const matchService = new MatchService();
const tournamentService = new TournamentService();

const matchRouter = new MatchRouter(
  authService,
  matchService,
  tournamentService as any
);
app.use("/matches", matchRouter.router);

describe("MatchRouter", () => {
  describe("POST /matches/create", () => {
    it("should create a match", async () => {
      matchService.createMatch.mockResolvedValueOnce({});
      const response = await request(app)
        .post("/matches/create")
        .set("Cookie", "jwt=validtoken")
        .send({ some: "data" });
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Match created successfully");
    });

    it("should return 500 if there is a server error", async () => {
      matchService.createMatch.mockRejectedValueOnce(new Error("Server error"));
      const response = await request(app)
        .post("/matches/create")
        .set("Cookie", "jwt=validtoken")
        .send({ some: "data" });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error");
    });
  });

  describe("PUT /matches/edit", () => {
    it("should edit a match", async () => {
      matchService.getMatchById.mockResolvedValueOnce({ finished: false });
      matchService.updateMatch.mockResolvedValueOnce({});
      const response = await request(app)
        .put("/matches/edit")
        .set("Cookie", "jwt=validtoken")
        .send({ id: 1, updateData: { some: "data" } });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Match updated successfully");
    });

    it("should return 400 if match ID is not provided", async () => {
      const response = await request(app)
        .put("/matches/edit")
        .set("Cookie", "jwt=validtoken")
        .send({ updateData: { some: "data" } });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Match ID is required");
    });

    it("should return 404 if match is not found", async () => {
      matchService.getMatchById.mockResolvedValueOnce(null);
      const response = await request(app)
        .put("/matches/edit")
        .set("Cookie", "jwt=validtoken")
        .send({ id: 1, updateData: { some: "data" } });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Match not found");
    });

    it("should return 500 if there is a server error", async () => {
      matchService.getMatchById.mockRejectedValueOnce(
        new Error("Server error")
      );
      const response = await request(app)
        .put("/matches/edit")
        .set("Cookie", "jwt=validtoken")
        .send({ id: 1, updateData: { some: "data" } });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error");
    });
  });

  describe("GET /matches/:id", () => {
    it("should get a match by ID", async () => {
      matchService.getMatchById.mockResolvedValueOnce({ id: 1 });
      matchService.getLastMatchesBetweenPlayers.mockResolvedValueOnce([]);
      const response = await request(app).get("/matches/1");
      expect(response.status).toBe(200);
      expect(response.body.match.id).toBe(1);
    });

    it("should return 404 if match is not found", async () => {
      matchService.getMatchById.mockResolvedValueOnce(null);
      const response = await request(app).get("/matches/1");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Match not found");
    });

    it("should return 500 if there is a server error", async () => {
      matchService.getMatchById.mockRejectedValueOnce(
        new Error("Server error")
      );
      const response = await request(app).get("/matches/1");
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error");
    });
  });

  describe("GET /matches/user/:id", () => {
    it("should get matches for a user", async () => {
      matchService.getUpcomingMatchesForUser.mockResolvedValueOnce([]);
      const response = await request(app).get("/matches/user/1");
      expect(response.status).toBe(200);
    });

    it("should return 500 if there is a server error", async () => {
      matchService.getUpcomingMatchesForUser.mockRejectedValueOnce(
        new Error("Server error")
      );
      const response = await request(app).get("/matches/user/1");
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error");
    });
  });

  describe("GET /matches/query", () => {
    it("should query matches", async () => {
      matchService.queryMatches.mockResolvedValueOnce([]);
      const response = await request(app).get("/matches/query?query=test");
      expect(response.status).toBe(200);
    });

    it("should return 500 if there is a server error", async () => {
      matchService.queryMatches.mockRejectedValueOnce(
        new Error("Server error")
      );
      const response = await request(app).get("/matches/query?query=test");
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error");
    });
  });
});
