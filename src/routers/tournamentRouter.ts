import AuthService from "services/authService";
import express, { Request, Response } from "express";
import Tournament, {
  TournamentCreationAttributes,
  TournamentFilterOptions,
} from "models/Tournament";
import TournamentService from "services/tournamentService";
import sequelize from "config/database";

class TournamentRouter {
  public router = express.Router();
  private tournamentService;
  private authService;

  constructor() {
    this.tournamentService = new TournamentService();
    this.authService = new AuthService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/create",
      this.authService.isAuthenticated,
      this.createTournament
    );
    this.router.post(
      "/edit",
      this.authService.isAuthenticated,
      this.editTournament
    );
    this.router.get("/all/:query?", this.getTournaments);
    this.router.get("/one/:id", this.getTournament);
  }

  private createTournament = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const input = req.body as TournamentCreationAttributes;

    const existingTournament = await Tournament.findOne({
      where: {
        name: input.name,
      },
    });

    if (existingTournament) {
      return res
        .status(400)
        .json({ message: "Tournament with this name already exists" });
    }

    const t = await sequelize.transaction();
    try {
      await this.tournamentService.createTournament(input, t);
      await t.commit();
      return res
        .status(201)
        .json({ message: "Tournament created successfully" });
    } catch (e: any) {
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private editTournament = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { id, ...updateData } = req.body;

    const t = await sequelize.transaction();
    try {
      const updated = await this.tournamentService.editTournament(
        id,
        updateData,
        t
      );

      if (!updated) {
        await t.rollback();
        return res.status(404).json({ message: "Tournament not found" });
      }

      await t.commit();
      return res
        .status(200)
        .json({ message: "Tournament updated successfully" });
    } catch (e: any) {
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private getTournaments = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const filterOptions = req.body as TournamentFilterOptions;

    try {
      const tournaments = await this.tournamentService.getFilteredTournaments(
        filterOptions
      );
      return res.status(200).json(tournaments);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private getTournament = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      const tournament = await this.tournamentService.getTournamentById(
        Number(id)
      );

      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }

      return res.status(200).json(tournament);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };
}

export default TournamentRouter;
