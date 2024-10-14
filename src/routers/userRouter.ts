import express, { Request, Response } from "express";
import AuthService from "../services/authService";
import UserService from "../services/userService";

class UserRouter {
  public router = express.Router();
  private authService;
  private userService;

  constructor(authService: AuthService, userService: UserService) {
    this.authService = authService;
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/search", this.getUsersByQuery);
    this.router.get("/ranking", this.getUserRanking);
    this.router.get("/profile/:id", this.getPlayerProfile);
    this.router.get(
      "/one/:id",
      this.authService.isAuthenticated,
      this.getUserById
    );
  }

  private getUserRanking = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      const ranking = await this.userService.getRanking();
      return res.status(200).json(ranking);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private getPlayerProfile = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { id } = req.params;

    try {
      const user = await this.userService.getUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const playerInfo = await this.userService.getPlayerInfo(parseInt(id));
      const userWithPlayerInfo = { ...user.toJSON(), playerInfo };

      return res.status(200).json(userWithPlayerInfo);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private getUserById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      const user = await this.userService.getUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private getUsersByQuery = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { query = "", limit = 10 } = req.query as {
      query?: string;
      limit?: number;
    };

    try {
      const users = await this.userService.getUsersByQuery(query, limit);
      return res.status(200).json(users);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };
}

export default UserRouter;
