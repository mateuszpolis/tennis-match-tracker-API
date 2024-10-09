import express, { Request, Response } from "express";
import AuthService from "../services/authService";
import MatchService from "../services/matchService";
import { MatchCreationAttributes } from "../models/Match";
import sequelize from "../config/database";
import TournamentService from "../services/tournamentService";

class MatchRouter {
  public router = express.Router();
  private authService;
  private matchService;
  private tournamentService;

  constructor() {
    this.authService = new AuthService();
    this.matchService = new MatchService();
    this.tournamentService = new TournamentService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/create",
      this.authService.isAuthenticated,
      this.createMatch
    );
    this.router.put("/edit", this.authService.isAuthenticated, this.editMatch);
    this.router.get("/:id", this.getMatch);
  }

  private editMatch = async (req: Request, res: Response): Promise<any> => {
    const { id, ...updateData } = req.body as MatchCreationAttributes;

    if (!id) {
      return res.status(400).json({ message: "Match ID is required" });
    }

    const match = await this.matchService.getMatchById(id);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.finished) {
      return res.status(400).json({ message: "Match is already finished" });
    }

    const t = await sequelize.transaction();
    try {
      await this.matchService.updateMatch(id, updateData, t);
      await this.matchService.setFinishedStatus(id, t);
      if (match.tournamentEditionId) {
        await this.tournamentService.tournamentMatchResult(match, t);
      }
      await t.commit();
      return res.status(200).json({ message: "Match updated successfully" });
    } catch (e: any) {
      console.log(e);
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private createMatch = async (req: Request, res: Response): Promise<any> => {
    const input = req.body as MatchCreationAttributes;

    const t = await sequelize.transaction();
    try {
      await this.matchService.createMatch(input, t);
      await t.commit();
      return res.status(201).json({ message: "Match created successfully" });
    } catch (e: any) {
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private getMatch = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      const match = await this.matchService.getMatchById(parseInt(id));
      return res.status(200).json(match);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };
}

export default new MatchRouter().router;
