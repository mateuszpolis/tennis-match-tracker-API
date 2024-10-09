import UserTournamentEdition from "../models/UserTournamentEdition";
import TennisGround from "../models/TennisGround";
import Tournament, {
  TournamentCreationAttributes,
  TournamentFilterOptions,
} from "../models/Tournament";
import TournamentEdition, {
  TournamentEditionCreationAttributes,
} from "../models/TournamentEdition";
import { Op, Transaction } from "sequelize";
import User from "../models/User";
import MatchService from "./matchService";
import Match from "../models/Match";

export default class TournamentService {
  private matchService;

  constructor() {
    this.matchService = new MatchService();
  }

  public createTournament = async (
    tournament: TournamentCreationAttributes,
    t: Transaction
  ) => {
    const tennisGround = await TennisGround.findByPk(
      tournament.tennisGroundId,
      {
        transaction: t,
      }
    );

    if (!tennisGround) {
      throw new Error("Tennis Ground not found");
    }

    const tournamentData = {
      ...tournament,
      surface: tennisGround.surface,
    };

    return await Tournament.create(tournamentData, { transaction: t });
  };

  public editTournament = async (
    id: number,
    updateData: Partial<TournamentCreationAttributes>,
    t: Transaction
  ) => {
    if (updateData.tennisGroundId) {
      const tennisGround = await TennisGround.findByPk(
        updateData.tennisGroundId
      );

      if (!tennisGround) {
        throw new Error("Tennis Ground not found");
      }

      updateData.surface = tennisGround.surface;
    }

    const [updatedRows] = await Tournament.update(updateData, {
      where: { id },
      transaction: t,
    });

    return updatedRows > 0;
  };

  public getTournaments = async (query?: string) => {
    const whereClause = query ? { name: { [Op.like]: `%${query}%` } } : {};

    return await Tournament.findAll({ where: whereClause });
  };

  public getTournamentById = async (id: number) => {
    return await Tournament.findByPk(id, {
      include: [
        {
          model: TournamentEdition,
          as: "editions",
          include: [
            {
              model: Tournament,
              as: "tournament",
            },
          ],
        },
        {
          model: TennisGround,
          as: "ground",
        },
      ],
    });
  };

  public getFilteredTournaments = async (
    filterOptions: TournamentFilterOptions
  ) => {
    const { name, groundId, surface, sortByStartDate, sortByEndDate } =
      filterOptions;

    const whereClause: any = {};

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }
    if (groundId) {
      whereClause.groundId = groundId;
    }
    if (surface) {
      whereClause.surface = surface;
    }

    const orderClause: any[] = [];
    if (sortByStartDate) {
      orderClause.push(["startDate", sortByStartDate]);
    }
    if (sortByEndDate) {
      orderClause.push(["endDate", sortByEndDate]);
    }

    return await Tournament.findAll({
      where: whereClause,
      order: orderClause,
      include: ["ground"],
    });
  };

  public createTournamentEdition = async (
    tournamentEdition: TournamentEditionCreationAttributes,
    t: Transaction
  ) => {
    const editionWithYear = {
      ...tournamentEdition,
      year: new Date().getFullYear(),
    };

    return await TournamentEdition.create(editionWithYear, {
      transaction: t,
    });
  };

  public editTournamentEdition = async (
    year: number,
    tournamentId: number,
    updateData: Partial<TournamentEditionCreationAttributes>,
    t: Transaction
  ) => {
    const [updatedRows] = await TournamentEdition.update(updateData, {
      where: { year, tournamentId },
      transaction: t,
    });

    return updatedRows > 0;
  };

  public getFilteredTournamentEditions = async (
    filterOptions: TournamentFilterOptions
  ) => {
    const {
      name,
      groundId,
      surface,
      sortByStartDate,
      sortByEndDate,
      startDateAfter,
    } = filterOptions;

    const whereClause: any = {};

    if (name) {
      whereClause["$Tournament.name$"] = { [Op.like]: `%${name}%` };
    }
    if (groundId) {
      whereClause["$Tournament.groundId$"] = groundId;
    }
    if (surface) {
      whereClause["$Tournament.surface$"] = surface;
    }
    if (startDateAfter) {
      whereClause.startDate = { [Op.gt]: startDateAfter };
    }

    const orderClause: any[] = [];
    if (sortByStartDate) {
      orderClause.push(["startDate", sortByStartDate]);
    }
    if (sortByEndDate) {
      orderClause.push(["endDate", sortByEndDate]);
    }

    return await TournamentEdition.findAll({
      where: whereClause,
      order: orderClause,
      include: ["tournament"],
    });
  };

  public getTournamentEditionById = async (tournamentEditionId: number) => {
    return await TournamentEdition.findByPk(tournamentEditionId, {
      include: [
        {
          model: UserTournamentEdition,
          as: "players",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
        {
          model: Tournament,
          as: "tournament",
        },
      ],
    });
  };

  public getTournamentEditionForTournamentByYear = async (
    tournamentId: number,
    year: number
  ) => {
    return await TournamentEdition.findOne({
      where: {
        tournamentId,
        year,
      },
      include: [
        {
          model: UserTournamentEdition,
          as: "players",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
        {
          model: Match,
          as: "matches",
          include: [
            {
              model: User,
              as: "firstPlayer",
            },
            {
              model: User,
              as: "secondPlayer",
            },
            {
              model: TennisGround,
              as: "ground",
            },
          ],
        },
      ],
    });
  };

  public getUserTournamentEditionRecord = async (
    userId: number,
    tournamentEditionId: number
  ) => {
    return await UserTournamentEdition.findOne({
      where: {
        userId,
        tournamentEditionId,
      },
    });
  };

  public createUserTournamentEdition = async (
    userId: number,
    tournamentEditionId: number,
    t: Transaction
  ) => {
    await UserTournamentEdition.create(
      {
        userId,
        tournamentEditionId,
      },
      { transaction: t }
    );
  };

  public increasePlayerNumber = async (
    tournamentEdition: TournamentEdition,
    t: Transaction
  ) => {
    await tournamentEdition.update(
      {
        currentNumberOfContestants:
          tournamentEdition.currentNumberOfContestants + 1,
      },
      {
        transaction: t,
      }
    );

    await tournamentEdition.save({
      transaction: t,
    });
  };

  public closeTournamentRegistration = async (
    tournamentEdition: TournamentEdition,
    t: Transaction
  ) => {
    await tournamentEdition.update(
      {
        registrationOpen: false,
      },
      { transaction: t }
    );
  };

  public findPlayersForTournamentRound = async (
    tournamentEdition: TournamentEdition,
    t: Transaction
  ) => {
    const players = await UserTournamentEdition.findAll({
      where: {
        tournamentEditionId: tournamentEdition.id,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["rankingPoints"],
        },
      ],
      order: [["user", "rankingPoints", "DESC"]],
      transaction: t,
    });

    return players;
  };

  public drawRound = async (
    tournamentEdition: TournamentEdition,
    t: Transaction
  ): Promise<number> => {
    const numberOfMatches =
      tournamentEdition.maximumNumberOfContestants /
      Math.pow(2, tournamentEdition.round);

    const players = await this.findPlayersForTournamentRound(
      tournamentEdition,
      t
    );

    const pointsForRound = this.getPointsForRound(
      tournamentEdition.round,
      tournamentEdition
    );

    for (const player of players) {
      player.pointsReceived += pointsForRound;
      await player.save({ transaction: t });
    }

    if (numberOfMatches >= players.length) {
      players.forEach((player) => {
        player.round += 1;
        player.save({
          transaction: t,
        });
      });
      tournamentEdition.round += 1;
      tournamentEdition.save({
        transaction: t,
      });

      return 0;
    }

    const halfIndex = Math.ceil(players.length / 2);
    const group1 = players.slice(0, halfIndex);
    const group2 = players.slice(halfIndex);

    const matches = [];

    for (let i = 0; i < group1.length; i++) {
      const player1 = group1[i];

      if (i < group2.length) {
        const player2 = group2[group2.length - 1 - i];

        const match = {
          player1Id: player1.userId,
          player2Id: player2.userId,
          round: tournamentEdition.round,
        };

        matches.push(match);
      } else {
        player1.round += 1;
        await player1.save({ transaction: t });
      }
    }

    await this.matchService.createMatchesForTournament(
      tournamentEdition,
      matches,
      t
    );

    tournamentEdition.round += 1;
    await tournamentEdition.save({ transaction: t });

    return matches.length;
  };

  private getPointsForRound = (
    round: number,
    tournamentEdition: TournamentEdition
  ): number => {
    const totalPoints = tournamentEdition.tournament.points;
    const totalPlayers = tournamentEdition.maximumNumberOfContestants;

    const totalRounds = Math.ceil(Math.log2(totalPlayers));

    if (round === totalRounds) {
      return totalPoints;
    }

    if (round === totalRounds - 1) {
      return totalPoints * 0.4;
    }

    const decayFactor = 0.4;
    const roundFactor = Math.pow(decayFactor, totalRounds - round);

    return Math.floor(totalPoints * roundFactor);
  };

  public advancePlayerToNextRound = async (
    tournamentEdition: TournamentEdition,
    userId: number,
    t: Transaction
  ) => {
    const player = await UserTournamentEdition.findOne({
      where: {
        userId,
        tournamentEditionId: tournamentEdition.id,
      },
      transaction: t,
    });

    if (!player) {
      throw new Error("Player not found");
    }

    player.round += 1;
    player.pointsReceived += this.getPointsForRound(
      player.round,
      tournamentEdition
    );
    await player.save({ transaction: t });
  };

  public setTournamentWinner = async (
    tournamentEdition: TournamentEdition,
    userId: number,
    t: Transaction
  ) => {
    await tournamentEdition.update(
      {
        winnerId: userId,
      },
      { transaction: t }
    );
  };

  public assignPointsToPlayers = async (
    tournamentEdition: TournamentEdition,
    t: Transaction
  ) => {
    const players = await UserTournamentEdition.findAll({
      where: {
        tournamentEditionId: tournamentEdition.id,
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      transaction: t,
    });

    for (const player of players) {
      player.user.rankingPoints += player.pointsReceived;
      await player.user.save({ transaction: t });
    }
  };

  public grantFullPointsToWinner = async (
    tournamentEdition: TournamentEdition,
    t: Transaction
  ) => {
    const winner = await UserTournamentEdition.findOne({
      where: {
        userId: tournamentEdition.winnerId,
        tournamentEditionId: tournamentEdition.id,
      },
      transaction: t,
    });

    if (!winner) {
      throw new Error("Winner not found");
    }

    winner.pointsReceived = tournamentEdition.tournament.points;
    await winner.save({ transaction: t });
  };

  public closeTournamentEdition = async (
    tournamentEdition: TournamentEdition,
    t: Transaction
  ) => {
    await tournamentEdition.update(
      {
        registrationOpen: false,
      },
      { transaction: t }
    );
  };

  public tournamentMatchResult = async (match: Match, t: Transaction) => {
    const tournamentEdition = await TournamentEdition.findByPk(
      match.tournamentEditionId,
      {
        include: ["tournament"],
      }
    );

    if (!tournamentEdition) {
      throw new Error("Tournament edition not found");
    }

    const winnerId =
      match.firstPlayerScore > match.secondPlayerScore
        ? match.firstPlayerId
        : match.secondPlayerId;

    await this.advancePlayerToNextRound(tournamentEdition, winnerId, t);

    if (await this.checkIfRoundIsFinished(tournamentEdition, t)) {
      const matchesCount = await this.drawRound(tournamentEdition, t);

      if (matchesCount === 0) {
        await this.setTournamentWinner(tournamentEdition, winnerId, t);
        await this.grantFullPointsToWinner(tournamentEdition, t);
        await this.assignPointsToPlayers(tournamentEdition, t);
        await this.closeTournamentEdition(tournamentEdition, t);
      }
    }
  };

  public checkIfRoundIsFinished = async (
    tournamentEdition: TournamentEdition,
    t: Transaction
  ) => {
    const matches = await Match.findAll({
      where: {
        tournamentEditionId: tournamentEdition.id,
        round: tournamentEdition.round,
      },
      transaction: t,
    });

    const unfinishedMatches = matches.filter((match) => !match.finished);

    return unfinishedMatches.length === 0;
  };
}
