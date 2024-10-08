import express, { Request, Response } from "express";
import AuthService from "../services/authService";
import UserService from "../services/userService";

class UserRouter {
  public router = express.Router();
  private authService;
  private userService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/search",
      this.authService.isAuthenticated,
      this.getUsersByQuery
    );
    this.router.get("/one/:id", this.authService.isAuthenticated, this.getUserById);
  }

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
    const { query } = req.query as { query?: string };

    try {
      const users = await this.userService.getUsersByQuery(query || "");
      return res.status(200).json(users);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };
}

export default new UserRouter().router;
