import AuthService from "../services/authService";
import express, { Request, Response } from "express";
import Tournament, {
  TournamentCreationAttributes,
  TournamentFilterOptions,
} from "../models/Tournament";
import TournamentService from "../services/tournamentService";
import sequelize from "../config/database";
import { TournamentEditionCreationAttributes } from "../models/TournamentEdition";
import User from "../models/User";

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
    this.router.post(
      "/create/edition",
      this.authService.isAuthenticated,
      this.createTournamentEdition
    );
    this.router.post(
      "/edit/edition",
      this.authService.isAuthenticated,
      this.editTournamentEdition
    );
    this.router.get("/filter", this.getTournaments);
    this.router.get("/edition/filter", this.getTournamentEditions);
    this.router.get("/one/:id", this.getTournament);
    this.router.get("/edition/one", this.getTournamentEdition);
    this.router.post(
      "/edition/signup",
      this.authService.isAuthenticated,
      this.signupForTournament
    );
    this.router.post(
      "/edition/start",
      this.authService.isAuthenticated,
      this.startTournament
    );
  }

  // Tournaments
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
      console.log(e);
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private createTournamentEdition = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const input = req.body as TournamentEditionCreationAttributes;

    const existingTournament =
      await this.tournamentService.getTournamentEditionForTournamentByYear(
        input.tournamentId,
        new Date().getFullYear()
      );

    if (existingTournament) {
      return res
        .status(400)
        .json({ message: "Tournament edition for this year already exists." });
    }

    const t = await sequelize.transaction();
    try {
      await this.tournamentService.createTournamentEdition(input, t);
      await t.commit();
      return res
        .status(201)
        .json({ message: "Tournament edition created successfully" });
    } catch (e: any) {
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private editTournamentEdition = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { year, tournamentId, ...updateData } = req.body;

    const t = await sequelize.transaction();
    try {
      const updated = await this.tournamentService.editTournamentEdition(
        year,
        tournamentId,
        updateData,
        t
      );

      if (!updated) {
        await t.rollback();
        return res
          .status(404)
          .json({ message: "Tournament edition not found" });
      }

      await t.commit();
      return res
        .status(200)
        .json({ message: "Tournament edition updated successfully" });
    } catch (e: any) {
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private getTournamentEditions = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const filterOptions = req.query as unknown as TournamentFilterOptions;

    try {
      const tournamentEditions =
        await this.tournamentService.getFilteredTournamentEditions(
          filterOptions
        );
      return res.status(200).json(tournamentEditions);
    } catch (e: any) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private getTournamentEdition = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { tournamentId, year } = req.query;

    try {
      const tournamentEdition =
        await this.tournamentService.getTournamentEditionForTournamentByYear(
          Number(tournamentId),
          Number(year)
        );

      if (!tournamentEdition) {
        return res
          .status(404)
          .json({ message: "Tournament edition not found" });
      }

      return res.status(200).json(tournamentEdition);
    } catch (e: any) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private signupForTournament = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { tournamentEditionId } = req.body as {
      tournamentEditionId: number;
    };
    const userId = (req.user as User).id;

    const tournamentEdition =
      await this.tournamentService.getTournamentEditionById(
        tournamentEditionId
      );
    if (!tournamentEdition) {
      return res
        .status(404)
        .json({ message: "Tournament edition does not exist" });
    }

    if (
      tournamentEdition.currentNumberOfContestants ===
      tournamentEdition.maximumNumberOfContestants
    ) {
      return res
        .status(402)
        .json({ message: "The tournament has no free spots" });
    }

    if (!tournamentEdition.registrationOpen) {
      return res
        .status(404)
        .json({ message: "The registration for the tournament is closed" });
    }

    const existingRecord =
      await this.tournamentService.getUserTournamentEditionRecord(
        userId,
        tournamentEdition.id
      );

    if (existingRecord) {
      return res.status(400).json({ message: "User already signed-up" });
    }

    const t = await sequelize.transaction();
    try {
      await this.tournamentService.createUserTournamentEdition(
        userId,
        tournamentEdition.id,
        t
      );

      await this.tournamentService.increasePlayerNumber(tournamentEdition, t);

      await t.commit();

      return res
        .status(200)
        .json({ message: "User signed-up for the tournament" });
    } catch (e: any) {
      await t.rollback();

      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };

  private startTournament = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { tournamentEditionId } = req.body as {
      tournamentEditionId: number;
    };

    const tournamentEdition =
      await this.tournamentService.getTournamentEditionById(
        tournamentEditionId
      );

    if (!tournamentEdition) {
      return res
        .status(404)
        .json({ message: "Tournament edition does not exist" });
    }

    if (tournamentEdition.currentNumberOfContestants < 2) {
      return res.status(400).json({ message: "Not enough contestants" });
    }

    const t = await sequelize.transaction();
    try {
      await this.tournamentService.closeTournamentRegistration(
        tournamentEdition,
        t
      );

      let numberOfMatches = 0;

      let round = tournamentEdition.round;
      let maxRounds = Math.log2(tournamentEdition.maximumNumberOfContestants);
      do {
        numberOfMatches = await this.tournamentService.drawRound(
          tournamentEdition,
          t
        );

        round++;
      } while (numberOfMatches === 0 && round <= maxRounds);

      await t.commit();

      return res
        .status(200)
        .json({ message: "Tournament started successfully" });
    } catch (e: any) {
      await t.rollback();

      return res
        .status(500)
        .json({ message: "Server error", error: e.message });
    }
  };
}

export default new TournamentRouter().router;
