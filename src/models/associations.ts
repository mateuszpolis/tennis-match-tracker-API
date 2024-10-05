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
  foreignKey: "id",
  as: "tournaments",
});

TournamentEdition.belongsTo(Tournament, {
  foreignKey: "tournamentId",
  as: "tournament",
});

User.belongsToMany(TournamentEdition, {
  through: UserTournamentEdition,
  foreignKey: "userId",
  as: "tournamentEditions",
});

TournamentEdition.belongsToMany(User, {
  through: UserTournamentEdition,
  foreignKey: "tournamentEditionId",
  as: "users",
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
