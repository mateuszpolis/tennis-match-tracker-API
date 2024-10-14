import request from "supertest";
import express from "express";
import TournamentRouter from "../tournamentRouter";
import TournamentService from "../../services/__mocks__/tournamentService";
import AuthService from "../../services/__mocks__/authService";
import GroundService from "../../services/__mocks__/groundService";
import cookieParser from "cookie-parser";
import Tournament from "../../models/Tournament";

const app = express();
app.use(express.json());
app.use(cookieParser());

const mockTournamentService = new TournamentService();
const mockAuthService = new AuthService();
const mockGroundService = new GroundService();

const tournamentRouter = new TournamentRouter(
  mockTournamentService as any,
  mockAuthService,
  mockGroundService
);

app.use("/tournaments", tournamentRouter.router);

describe("TournamentRouter", () => {
  describe("POST /tournaments/create", () => {
    it("should create a tournament", async () => {
      jest.spyOn(mockGroundService, "getGroundById").mockResolvedValue({});
      jest
        .spyOn(mockTournamentService, "createTournament")
        .mockResolvedValue({});

      const response = await request(app)
        .post("/tournaments/create")
        .set("Cookie", "jwt=validtoken")
        .send({ name: "Test Tournament", tennisGroundId: 1 });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Tournament created successfully");
    });

    it("should return 400 if tournament already exists", async () => {
      jest.spyOn(mockGroundService, "getGroundById").mockResolvedValue({});
      jest.spyOn(Tournament, "findOne").mockResolvedValue({} as any);

      const response = await request(app)
        .post("/tournaments/create")
        .set("Cookie", "jwt=validtoken")
        .send({ name: "Test Tournament", tennisGroundId: 1 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Tournament with this name already exists"
      );
    });
  });

  describe("POST /tournaments/edit", () => {
    it("should edit a tournament", async () => {
      jest
        .spyOn(mockTournamentService, "editTournament")
        .mockResolvedValue([1]);
      jest
        .spyOn(mockTournamentService, "getTournamentById")
        .mockResolvedValue({});

      const response = await request(app)
        .post("/tournaments/edit")
        .set("Cookie", "jwt=validtoken")
        .send({ id: 1, name: "Updated Tournament" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Tournament updated successfully");
    });

    it("should return 404 if tournament not found", async () => {
      jest
        .spyOn(mockTournamentService, "editTournament")
        .mockResolvedValue([0]);
      jest
        .spyOn(mockTournamentService, "getTournamentById")
        .mockResolvedValue(null);

      const response = await request(app)
        .post("/tournaments/edit")
        .set("Cookie", "jwt=validtoken")
        .send({ id: 1, name: "Updated Tournament" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Tournament not found");
    });
  });

  describe("DELETE /tournaments/delete/:id", () => {
    it("should delete a tournament", async () => {
      jest
        .spyOn(mockTournamentService, "getTournamentById")
        .mockResolvedValue({});
      jest
        .spyOn(mockTournamentService, "deleteTournament")
        .mockResolvedValue(1);

      const response = await request(app)
        .delete("/tournaments/delete/1")
        .set("Cookie", "jwt=validtoken");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Tournament deleted successfully");
    });

    it("should return 404 if tournament not found", async () => {
      jest
        .spyOn(mockTournamentService, "getTournamentById")
        .mockResolvedValue(null);

      const response = await request(app)
        .delete("/tournaments/delete/1")
        .set("Cookie", "jwt=validtoken");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Tournament not found");
    });
  });

  describe("GET /tournaments/filter", () => {
    it("should get filtered tournaments", async () => {
      jest
        .spyOn(mockTournamentService, "getFilteredTournaments")
        .mockResolvedValue([]);

      const response = await request(app).get("/tournaments/filter").send({});

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /tournaments/one/:id", () => {
    it("should get a tournament by id", async () => {
      jest
        .spyOn(mockTournamentService, "getTournamentById")
        .mockResolvedValue({ id: 1 });

      const response = await request(app).get("/tournaments/one/1");

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
    });

    it("should return 404 if tournament not found", async () => {
      jest
        .spyOn(mockTournamentService, "getTournamentById")
        .mockResolvedValue(null);

      const response = await request(app).get("/tournaments/one/1");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Tournament not found");
    });
  });
});
