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
            {
              model: User,
              as: "winner",
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
      year: new Date(tournamentEdition.startDate).getFullYear(),
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

    if (filterOptions.isFinished === "yes") {
      whereClause.winnerId = { [Op.not]: null };
    } else if (filterOptions.isFinished === "no") {
      whereClause.winnerId = null;
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
        {
          model: User,
          as: "winner",
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
        round: tournamentEdition.round,
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
      player.pointsReceived = pointsForRound;
      await player.save({ transaction: t });
    }

    if (numberOfMatches >= players.length) {
      for (const player of players) {
        player.round += 1;
        await player.save({
          transaction: t,
        });
      }

      return 0;
    }

    const group1 = [] as UserTournamentEdition[];
    const group2 = [] as UserTournamentEdition[];
    for (let i = 0; i < players.length; i++) {
      if (i % 2 === 0) {
        group1.push(players[i]);
      } else {
        group2.push(players[i]);
      }
    }

    const matches = [] as {
      player1Id: number;
      player2Id: number;
      round: number;
    }[];

    if (group1.length === 1 && group2.length === 1) {
      matches.push({
        player1Id: group1[0].userId,
        player2Id: group2[0].userId,
        round: tournamentEdition.round,
      });
    } else {
      for (let i = 0; i < group1.length / 2; i++) {
        if (i >= group1.length - 1 - i) {
          group1[i].round += 1;
          await group1[i].save({ transaction: t });
        } else {
          matches.push({
            player1Id: group1[i].userId,
            player2Id: group1[group1.length - i - 1].userId,
            round: tournamentEdition.round,
          });
        }
      }

      for (let i = 0; i < group2.length / 2; i++) {
        if (i >= group2.length - 1 - i) {
          group2[i].round += 1;
          await group2[i].save({ transaction: t });
        } else {
          matches.push({
            player1Id: group2[i].userId,
            player2Id: group2[group2.length - i - 1].userId,
            round: tournamentEdition.round,
          });
        }
      }
    }

    await this.matchService.createMatchesForTournament(
      tournamentEdition,
      matches,
      t
    );

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
      return totalPoints * 0.6;
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
    player.pointsReceived = this.getPointsForRound(
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

  public tournamentMatchResult = async (matchId: number, t: Transaction) => {
    const match = await Match.findByPk(matchId, {
      include: ["firstPlayer", "secondPlayer"],
      transaction: t,
    });

    if (!match) {
      throw new Error("Match not found");
    }

    const tournamentEdition = await TournamentEdition.findByPk(
      match.tournamentEditionId,
      {
        include: ["tournament"],
        transaction: t,
      }
    );

    if (!tournamentEdition) {
      throw new Error("Tournament edition not found");
    }

    const winnerId =
      match.firstPlayerScore > match.secondPlayerScore
        ? match.firstPlayerId
        : match.secondPlayerId;
    const loserId =
      match.firstPlayerScore > match.secondPlayerScore
        ? match.secondPlayerId
        : match.firstPlayerId;

    const winner = await UserTournamentEdition.findOne({
      where: {
        userId: winnerId,
        tournamentEditionId: match.tournamentEditionId,
      },
      transaction: t,
    });

    const loser = await UserTournamentEdition.findOne({
      where: {
        userId: loserId,
        tournamentEditionId: match.tournamentEditionId,
      },
      transaction: t,
    });

    if (!winner || !loser) {
      throw new Error("Player not found");
    }

    winner.numberOfWins += 1;
    winner.numberOfMatches += 1;
    await winner.save({ transaction: t });

    loser.numberOfLosses += 1;
    loser.numberOfMatches += 1;
    await loser.save({ transaction: t });

    await this.advancePlayerToNextRound(tournamentEdition, winnerId, t);

    if (await this.checkIfRoundIsFinished(tournamentEdition, t)) {
      tournamentEdition.round += 1;
      await tournamentEdition.save({ transaction: t });
      const matchesCount = await this.drawRound(tournamentEdition, t);

      if (matchesCount === 0) {
        winner.pointsReceived = tournamentEdition.tournament.points;
        await winner.save({ transaction: t });

        await this.setTournamentWinner(tournamentEdition, winnerId, t);
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

  public deleteTournament = async (id: number, t: Transaction) => {
    return await Tournament.destroy({ where: { id }, transaction: t });
  };

  public deleteTournamentEdition = async (
    tournamentEditionId: number,
    t: Transaction
  ) => {
    return await TournamentEdition.destroy({
      where: { id: tournamentEditionId },
      transaction: t,
    });
  };

  removePointsFromPreviousEdition = async (
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
      player.user.rankingPoints -= player.pointsReceived;
      await player.user.save({ transaction: t });
    }
  };

  public getTournamentEditionsForUser = async (userId: number) => {
    return await TournamentEdition.findAll({
      include: [
        {
          model: UserTournamentEdition,
          as: "players",
          where: {
            userId,
          },
        },
        {
          model: Tournament,
          as: "tournament",
        },
      ],
      order: [["startDate", "DESC"]],
    });
  };

  public queryTournamentEditions = async (query: string) => {
    return await TournamentEdition.findAll({
      include: [
        {
          model: Tournament,
          as: "tournament",
          where: {
            name: {
              [Op.like]: `%${query}%`,
            },
          },
        },
      ],
      limit: 5,
    });
  };

  public queryTournaments = async (query: string) => {
    return await Tournament.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
      limit: 5,
    });
  };
}
