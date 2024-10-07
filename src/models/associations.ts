import Match from "./Match";
import PlayerStats from "./PlayerStats";
import TennisGround from "./TennisGround";
import Tournament from "./Tournament";
import TournamentEdition from "./TournamentEdition";
import User from "./User";
import UserTournamentEdition from "./UserTournamentEdition";

Tournament.belongsTo(TennisGround, {
  foreignKey: "tennisGroundId",
  as: "ground",
});

Tournament.hasMany(TournamentEdition, {
  foreignKey: "tournamentId",
  as: "editions",
});

TennisGround.hasMany(Tournament, {
  foreignKey: "tennisGroundId",
  as: "tournaments",
});

TournamentEdition.belongsTo(Tournament, {
  foreignKey: "tournamentId",
  as: "tournament",
});

TournamentEdition.hasMany(UserTournamentEdition, {
  foreignKey: "tournamentEditionId",
  as: "players",
});

UserTournamentEdition.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(UserTournamentEdition, {
  foreignKey: "userId",
  as: "tournamentEditions",
});

TournamentEdition.hasMany(Match, {
  foreignKey: "tournamentEditionId",
  as: "matches",
});

Match.belongsTo(User, { as: "firstPlayer", foreignKey: "firstPlayerId" });

Match.belongsTo(User, { as: "secondPlayer", foreignKey: "secondPlayerId" });

Match.belongsTo(TennisGround, { as: "ground", foreignKey: "groundId" });

Match.belongsTo(Tournament, { as: "tournament", foreignKey: "tournamentId" });

Match.belongsTo(PlayerStats, {
  as: "firstPlayerStats",
  foreignKey: "firstPlayerStatsId",
});

Match.belongsTo(PlayerStats, {
  as: "secondPlayerStats",
  foreignKey: "secondPlayerStatsId",
});
