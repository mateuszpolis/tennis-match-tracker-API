import TournamentEdition from "../models/TournamentEdition";
import Match, { MatchCreationAttributes } from "../models/Match";
import { Op, Transaction } from "sequelize";
import PlayerStats, { PlayerStatsAttributes } from "../models/PlayerStats";
import User from "../models/User";
import Tournament from "../models/Tournament";

export default class MatchService {
  public createMatchesForTournament = async (
    tournamentEdition: TournamentEdition,
    matches: {
      player1Id: number;
      player2Id: number;
      round: number;
    }[],
    t: Transaction
  ) => {
    const matchData: MatchCreationAttributes[] = matches.map((match) => ({
      firstPlayerId: match.player1Id,
      secondPlayerId: match.player2Id,
      date: tournamentEdition.startDate,
      firstPlayerScore: 0,
      secondPlayerScore: 0,
      groundId: tournamentEdition.tournament.tennisGroundId,
      surface: tournamentEdition.tournament.surface,
      finished: false,
      tournamentEditionId: tournamentEdition.id,
      round: match.round,
    }));

    return await Match.bulkCreate(matchData, { transaction: t });
  };

  public getMatchById = async (id: number, t: Transaction) => {
    return await Match.findByPk(id, {
      include: [
        "firstPlayer",
        "secondPlayer",
        "ground",
        "firstPlayerStats",
        "secondPlayerStats",
        {
          model: TournamentEdition,
          as: "tournamentEdition",
          include: ["tournament"],
        },
      ],
      transaction: t,
    });
  };

  public createMatch = async (
    match: MatchCreationAttributes,
    t: Transaction
  ) => {
    return await Match.create(match, { transaction: t });
  };

  public updateMatch = async (
    id: number,
    match: MatchCreationAttributes,
    t: Transaction
  ) => {
    return await Match.update(match, {
      where: { id },
      transaction: t,
    });
  };

  public setFinishedStatus = async (id: number, t: Transaction) => {
    return await Match.update(
      { finished: true },
      { where: { id }, transaction: t }
    );
  };

  public getLastMatchesBetweenPlayers = async (
    player1Id: number,
    player2Id: number,
    n: number
  ) => {
    return await Match.findAll({
      where: {
        [Op.or]: [
          {
            firstPlayerId: player1Id,
            secondPlayerId: player2Id,
          },
          {
            firstPlayerId: player2Id,
            secondPlayerId: player1Id,
          },
        ],
      },
      order: [["date", "DESC"]],
      limit: n,
      include: [
        "firstPlayer",
        "secondPlayer",
        {
          model: TournamentEdition,
          as: "tournamentEdition",
          include: ["tournament"],
        },
      ],
    });
  };

  public createOrUpdatePlayerStats = async (
    existingStatsId: number | undefined,
    stats: PlayerStatsAttributes,
    t: Transaction
  ): Promise<number> => {
    if (existingStatsId) {
      await PlayerStats.update(stats, {
        where: { id: existingStatsId },
        transaction: t,
      });
      return existingStatsId;
    } else {
      const newStats = await PlayerStats.create(stats, { transaction: t });
      return newStats.id;
    }
  };

  public getUpcomingMatchesForUser = async (userId: number) => {
    return await Match.findAll({
      where: {
        [Op.or]: [{ firstPlayerId: userId }, { secondPlayerId: userId }],
        finished: false,
      },
      include: [
        "firstPlayer",
        "secondPlayer",
        {
          model: TournamentEdition,
          as: "tournamentEdition",
          include: ["tournament"],
        },
      ],
    });
  };

  public queryMatches = async (query: string) => {
    return await Match.findAll({
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
          model: TournamentEdition,
          as: "tournamentEdition",
          include: [
            {
              model: Tournament,
              as: "tournament",
            },
          ],
        },
      ],
      where: {
        [Op.or]: [
          { "$firstPlayer.name$": { [Op.iLike]: `%${query}%` } },
          { "$secondPlayer.name$": { [Op.iLike]: `%${query}%` } },
          {
            "$tournamentEdition.tournament.name$": { [Op.iLike]: `%${query}%` },
          },
        ],
      },
      limit: 5,
    });
  };
}
