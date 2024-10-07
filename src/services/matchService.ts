import TournamentEdition from "models/TournamentEdition";
import Match, { MatchCreationAttributes } from "../models/Match";
import { Transaction } from "sequelize";
import { finished } from "stream";

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
}
