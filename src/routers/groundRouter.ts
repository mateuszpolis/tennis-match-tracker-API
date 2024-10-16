import express, { Request, Response } from "express";
import AuthService from "../services/authService";
import GroundService from "../services/groundService";
import { TennisGroundCreationAttributes } from "../models/TennisGround";
import { UserRole } from "../models/User";
import { Sequelize } from "sequelize";

class GroundRouter {
  public router = express.Router();
  private groundService: GroundService;
  private authService: AuthService;
  private sequelize;

  constructor(
    groundService: GroundService,
    authService: AuthService,
    sequelize: Sequelize
  ) {
    this.groundService = groundService;
    this.authService = authService;
    this.sequelize = sequelize;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.getTennisGrounds);
    this.router.get("/query", this.queryGrounds);
    this.router.get("/name/:name", this.getGroundsByName);
    this.router.get("/:id", this.getTennisGround);
    this.router.post(
      "/create",
      this.authService.isAuthenticated,
      this.authService.hasRole([UserRole.Admin]),
      this.createGround
    );
    this.router.put(
      "/edit",
      this.authService.isAuthenticated,
      this.authService.hasRole([UserRole.Admin]),
      this.editGround
    );
    this.router.delete(
      "/delete/:id",
      this.authService.isAuthenticated,
      this.authService.hasRole([UserRole.Admin]),
      this.deleteGround
    );
  }

  private createGround = async (req: Request, res: Response): Promise<any> => {
    const input = req.body as TennisGroundCreationAttributes;

    const t = await this.sequelize.transaction();
    try {
      await this.groundService.createGround(input, t);
      await t.commit();
      return res
        .status(201)
        .json({ message: "Tennis ground created successfully" });
    } catch (e: any) {
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private editGround = async (req: Request, res: Response): Promise<any> => {
    const { id, ...updateData } = req.body;

    const t = await this.sequelize.transaction();
    try {
      const updated = await this.groundService.editGround(id, updateData, t);

      if (!updated) {
        await t.rollback();
        return res.status(404).json({ message: "Tennis ground not found" });
      }

      await t.commit();
      return res
        .status(200)
        .json({ message: "Tennis ground updated successfully" });
    } catch (e: any) {
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private deleteGround = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const t = await this.sequelize.transaction();
    try {
      const deleted = await this.groundService.deleteGround(Number(id), t);

      if (!deleted) {
        await t.rollback();
        return res.status(404).json({ message: "Tennis ground not found" });
      }

      await t.commit();
      return res
        .status(200)
        .json({ message: "Tennis ground deleted successfully" });
    } catch (e: any) {
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private getTennisGrounds = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      const grounds = await this.groundService.getAllGrounds();
      return res.status(200).json(grounds);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private getTennisGround = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { id } = req.params;

    try {
      const ground = await this.groundService.getGroundById(Number(id));

      if (!ground) {
        return res.status(404).json({ message: "Tennis ground not found" });
      }

      return res.status(200).json(ground);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private getGroundsByName = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { name } = req.params;

    try {
      const grounds = await this.groundService.getGroundsByName(name);

      return res.status(200).json(grounds);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private queryGrounds = async (req: Request, res: Response): Promise<any> => {
    const query = req.query.query as string;

    try {
      const grounds = await this.groundService.queryGrounds(query);
      return res.status(200).json(grounds);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };
}

export default GroundRouter;
