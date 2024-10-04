import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface PlayerStatsAttributes {
  id: number;
  aces: number;
  doubleFaults: number;
  firstServePercentage: number;
  pointsWonOnFirstServe: number;
  pointsWonOnSecondServe: number;
  breakPointsSaved: number;
  returnPointsWonOnFirstServe: number;
  returnPointsWonOnSecondServe: number;
  breakPointsConverted: number;
  winners: number;
  unforcedErrors: number;
  netPointsWon: number;
  consecutivePointsWon: number;
  servicePointsWon: number;
  returnPointsWon: number;
}

interface PlayerStatsCreationAttributes extends Optional<PlayerStatsAttributes, "id"> {}

class PlayerStats extends Model<PlayerStatsAttributes, PlayerStatsCreationAttributes>
  implements PlayerStatsAttributes {
  declare id: number;
  declare aces: number;
  declare doubleFaults: number;
  declare firstServePercentage: number;
  declare pointsWonOnFirstServe: number;
  declare pointsWonOnSecondServe: number;
  declare breakPointsSaved: number;
  declare returnPointsWonOnFirstServe: number;
  declare returnPointsWonOnSecondServe: number;
  declare breakPointsConverted: number;
  declare winners: number;
  declare unforcedErrors: number;
  declare netPointsWon: number;
  declare consecutivePointsWon: number;
  declare servicePointsWon: number;
  declare returnPointsWon: number;
}

PlayerStats.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    aces: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doubleFaults: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstServePercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pointsWonOnFirstServe: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pointsWonOnSecondServe: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    breakPointsSaved: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    returnPointsWonOnFirstServe: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    returnPointsWonOnSecondServe: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    breakPointsConverted: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    winners: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unforcedErrors: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    netPointsWon: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    consecutivePointsWon: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    servicePointsWon: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    returnPointsWon: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "player_stats",
  }
);

export default PlayerStats;
