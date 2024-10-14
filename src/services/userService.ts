import { Op } from "sequelize";
import User, { PlayerAbility, PlayerInfo } from "../models/User";
import Match from "../models/Match";
import PlayerStats, { higherBetter } from "../models/PlayerStats";

export default class UserService {
  public getUsersByQuery = async (query: string = "", limit: number = 5) => {
    if (!query) {
      return await User.findAll();
    }

    return await User.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            surname: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
      limit,
    });
  };

  public getUserById = async (id: number) => {
    return await User.findByPk(id);
  };

  public getRanking = async () => {
    return await User.findAll({
      attributes: ["id", "name", "surname", "rankingPoints"],
      order: [["rankingPoints", "DESC"]],
    });
  };

  public getPlayerInfo = async (userId: number): Promise<PlayerInfo> => {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const matches = await Match.findAll({
      where: {
        [Op.or]: [{ firstPlayerId: userId }, { secondPlayerId: userId }],
        finished: true,
      },
      include: [
        {
          model: PlayerStats,
          as: "firstPlayerStats",
          required: false,
        },
        {
          model: PlayerStats,
          as: "secondPlayerStats",
          required: false,
        },
        {
          model: User,
          as: "firstPlayer",
        },
        {
          model: User,
          as: "secondPlayer",
        },
      ],
      order: [["date", "DESC"]],
    });

    if (matches.length === 0) {
      return {
        activeSince: null,
        wins: 0,
        losses: 0,
        gameHistory: [],
        playerPower: [],
        playerRating: 0,
      };
    }

    const activeSince = matches[matches.length - 1].date;
    let wins = 0;
    let losses = 0;
    const gameHistory = matches;

    const aggregatedStats: { [key: string]: number } = {};
    const statFields = [
      "aces",
      "doubleFaults",
      "firstServePercentage",
      "pointsWonOnFirstServe",
      "pointsWonOnSecondServe",
      "breakPointsSaved",
      "returnPointsWonOnFirstServe",
      "returnPointsWonOnSecondServe",
      "breakPointsConverted",
      "winners",
      "unforcedErrors",
      "netPointsWon",
      "consecutivePointsWon",
      "servicePointsWon",
      "returnPointsWon",
    ];

    statFields.forEach((field) => {
      aggregatedStats[field] = 0;
    });

    let statsCount = 0;

    for (const match of matches) {
      let userScore = 0;
      let opponentScore = 0;
      let playerStats = null;
      let opponentStats = null;

      if (match.firstPlayerId === userId) {
        userScore = match.firstPlayerScore;
        opponentScore = match.secondPlayerScore;
        playerStats = match.firstPlayerStats;
        opponentStats = match.secondPlayerStats;
      } else {
        userScore = match.secondPlayerScore;
        opponentScore = match.firstPlayerScore;
        playerStats = match.secondPlayerStats;
        opponentStats = match.firstPlayerStats;
      }

      if (userScore > opponentScore) {
        wins++;
      } else {
        losses++;
      }

      if (playerStats) {
        statsCount++;
        statFields.forEach((field) => {
          const playerAbilityComparedToOpponent = higherBetter.includes(field)
            ? (playerStats as any)[field] /
              Math.max(
                (playerStats as any)[field],
                (opponentStats as any)[field]
              )
            : (opponentStats as any)[field] /
              Math.max(
                (playerStats as any)[field],
                (opponentStats as any)[field]
              );
          aggregatedStats[field] += playerAbilityComparedToOpponent;
        });
      }
    }

    const averageStats: { [key: string]: number } = {};
    statFields.forEach((field) => {
      averageStats[field] = aggregatedStats[field] / statsCount;
    });

    const playerPower: PlayerAbility[] = [];

    statFields.forEach((field) => {
      const value = averageStats[field];
      playerPower.push({
        name: field,
        rating: value,
      });
    });

    // rating from 1 to 99 based on the average stats
    const totalStats = playerPower.length;
    const playerRating = Math.round(
      (playerPower.reduce((acc, stat) => acc + stat.rating, 0) / totalStats) *
        99
    );

    return {
      activeSince,
      wins,
      losses,
      gameHistory,
      playerPower,
      playerRating,
    };
  };
}
