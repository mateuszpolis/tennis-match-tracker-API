import TournamentEdition from "../models/TournamentEdition";
import Match, { MatchCreationAttributes } from "../models/Match";
import { Op, Transaction } from "sequelize";
import TournamentService from "./tournamentService";

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

  public getMatchById = async (id: number) => {
    return await Match.findByPk(id, {
      include: [
        "firstPlayer",
        "secondPlayer",
        "ground",
        "firstPlayerStats",
        {
          model: TournamentEdition,
          as: "tournamentEdition",
          include: ["tournament"],
        },
      ],
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
}
