import request from "supertest";
import express from "express";
import GroundRouter from "../groundRouter";
import AuthService from "../../services/__mocks__/authService";
import GroundService from "../../services/__mocks__/groundService";
import cookieParser from "cookie-parser";
import sequelize from "../../config/database";

jest.mock("../../services/groundService");
jest.mock("../../services/authService");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authService = new AuthService();
const groundService = new GroundService();
const sequelizeMock = sequelize as jest.Mocked<typeof sequelize>;

const tMock = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

sequelizeMock.transaction = jest.fn().mockResolvedValue(tMock as any);

const groundRouter = new GroundRouter(groundService, authService, sequelizeMock);
app.use("/grounds", groundRouter.router);

describe("GroundRouter", () => {
  it("should create a new tennis ground", async () => {
    groundService.createGround.mockResolvedValue({});

    const response = await request(app)
      .post("/grounds/create")
      .set("Cookie", "jwt=validtoken")
      .send({ name: "Test Ground" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Tennis ground created successfully");

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(tMock.commit).toHaveBeenCalled();
    expect(tMock.rollback).not.toHaveBeenCalled();
  });

  it("should edit an existing tennis ground", async () => {
    groundService.editGround.mockResolvedValue(true);
    const response = await request(app)
      .put("/grounds/edit")
      .set("Cookie", "jwt=validtoken")
      .send({ id: 1, name: "Updated Ground" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Tennis ground updated successfully");
  });

  it("should delete a tennis ground", async () => {
    groundService.deleteGround.mockResolvedValue(true);
    const response = await request(app)
      .delete("/grounds/delete/1")
      .set("Cookie", "jwt=validtoken");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Tennis ground deleted successfully");
  });

  it("should get all tennis grounds", async () => {
    groundService.getAllGrounds.mockResolvedValue([]);
    const response = await request(app).get("/grounds/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should get a tennis ground by ID", async () => {
    groundService.getGroundById.mockResolvedValue({
      id: 1,
      name: "Test Ground",
    });
    const response = await request(app).get("/grounds/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: "Test Ground" });
  });

  it("should get tennis grounds by name", async () => {
    groundService.getGroundsByName.mockResolvedValue([
      { id: 1, name: "Test Ground" },
    ]);
    const response = await request(app).get("/grounds/name/Test Ground");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "Test Ground" }]);
  });

  it("should query tennis grounds", async () => {
    groundService.queryGrounds.mockResolvedValue([
      { id: 1, name: "Test Ground" },
    ]);
    const response = await request(app).get("/grounds/query?query=Test");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "Test Ground" }]);
  });
});
