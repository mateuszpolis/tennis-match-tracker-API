import express, { Request, Response } from "express";
import AuthService from "../services/authService";
import GroundService from "../services/groundService";
import sequelize from "../config/database";
import TennisGround, {
  TennisGroundCreationAttributes,
} from "../models/TennisGround";
import { UserRole } from "../models/User";

class GroundRouter {
  public router = express.Router();
  private groundService: GroundService;
  private authService: AuthService;

  constructor() {
    this.groundService = new GroundService();
    this.authService = new AuthService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.getTennisGrounds);
    this.router.get("/:id", this.getTennisGround);
    this.router.get("/name/:name", this.getGroundsByName);
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

    const t = await sequelize.transaction();
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

    const t = await sequelize.transaction();
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

    const t = await sequelize.transaction();
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
}

export default new GroundRouter().router;
