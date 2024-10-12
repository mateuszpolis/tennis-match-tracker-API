import express, { Request, Response } from "express";
import AuthService from "../services/authService";
import MatchService from "../services/matchService";
import { MatchCreationAttributes } from "../models/Match";
import sequelize from "../config/database";
import TournamentService from "../services/tournamentService";
import { PlayerStatsAttributes } from "models/PlayerStats";

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
    const { id, firstPlayerStats, secondPlayerStats, updateData } =
      req.body as {
        id?: number;
        firstPlayerStats?: PlayerStatsAttributes | undefined;
        secondPlayerStats?: PlayerStatsAttributes | undefined;
        updateData: MatchCreationAttributes;
      };

    if (!id) {
      return res.status(400).json({ message: "Match ID is required" });
    }

    const t = await sequelize.transaction();
    try {
      const match = await this.matchService.getMatchById(id, t);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }

      if (match.finished) {
        return res.status(400).json({ message: "Match is already finished" });
      }

      if (firstPlayerStats && Object.keys(firstPlayerStats).length > 0) {
        const firstPlayerStatsId =
          await this.matchService.createOrUpdatePlayerStats(
            match.firstPlayerStatsId,
            firstPlayerStats,
            t
          );
        updateData.firstPlayerStatsId = firstPlayerStatsId;
      }

      if (secondPlayerStats && Object.keys(secondPlayerStats).length > 0) {
        const secondPlayerStatsId =
          await this.matchService.createOrUpdatePlayerStats(
            match.secondPlayerStatsId,
            secondPlayerStats,
            t
          );
        updateData.secondPlayerStatsId = secondPlayerStatsId;
      }

      console.log(
        "Before update: ",
        updateData.firstPlayerScore,
        updateData.secondPlayerScore
      );
      await this.matchService.updateMatch(id, updateData, t);
      console.log(
        "After update: ",
        updateData.firstPlayerScore,
        updateData.secondPlayerScore
      );

      await this.matchService.setFinishedStatus(id, t);

      if (match.tournamentEditionId) {
        await this.tournamentService.tournamentMatchResult(match.id, t);
      }

      await t.commit();
      return res.status(200).json({ message: "Match updated successfully" });
    } catch (e: any) {
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

    const t = await sequelize.transaction();
    try {
      const match = await this.matchService.getMatchById(parseInt(id), t);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      const lastMatches = await this.matchService.getLastMatchesBetweenPlayers(
        match.firstPlayerId,
        match.secondPlayerId,
        5
      );
      await t.commit();
      return res.status(200).json({
        match,
        lastMatches,
      });
    } catch (e: any) {
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };
}

export default new MatchRouter().router;
