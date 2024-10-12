import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface PlayerStatsAttributes {
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

export interface PlayerStatsCreationAttributes
  extends Optional<PlayerStatsAttributes, "id"> {}

class PlayerStats
  extends Model<PlayerStatsAttributes, PlayerStatsCreationAttributes>
  implements PlayerStatsAttributes
{
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
      allowNull: true,
    },
    doubleFaults: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    firstServePercentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    pointsWonOnFirstServe: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pointsWonOnSecondServe: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    breakPointsSaved: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    returnPointsWonOnFirstServe: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    returnPointsWonOnSecondServe: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    breakPointsConverted: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    winners: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    unforcedErrors: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    netPointsWon: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    consecutivePointsWon: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    servicePointsWon: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    returnPointsWon: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "player_stats",
  }
);

export const higherBetter: string[] = [
  "aces",
  "firstServePercentage",
  "pointsWonOnFirstServe",
  "pointsWonOnSecondServe",
  "breakPointsSaved",
  "returnPointsWonOnFirstServe",
  "returnPointsWonOnSecondServe",
  "breakPointsConverted",
  "winners",
  "netPointsWon",
  "consecutivePointsWon",
  "servicePointsWon",
  "returnPointsWon",
];

export const lowerBetter: string[] = ["doubleFaults", "unforcedErrors"];

export default PlayerStats;
