import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Tournament from "./Tournament";
import User from "./User";
import { Surface } from "./enums/Surface";
import TennisGround from "./TennisGround";
import PlayerStats from "./PlayerStats";

interface MatchAttributes {
  id: number;
  firstPlayerId: number;
  secondPlayerId: number;
  date: Date;
  firstPlayerScore: number;
  secondPlayerScore: number;
  groundId: number;
  surface: Surface;
  firstPlayerStatsId?: number;
  secondPlayerStatsId?: number;
  tournamentId?: number;
}

interface MatchCreationAttributes extends Optional<MatchAttributes, "id"> {}

class Match
  extends Model<MatchAttributes, MatchCreationAttributes>
  implements MatchAttributes
{
  declare id: number;
  declare firstPlayerId: number;
  declare secondPlayerId: number;
  declare date: Date;
  declare firstPlayerScore: number;
  declare secondPlayerScore: number;
  declare groundId: number;
  declare surface: Surface;
  declare firstPlayerStatsId?: number;
  declare secondPlayerStatsId?: number;
  declare tournamentId?: number;
}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstPlayerId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    secondPlayerId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    firstPlayerScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    secondPlayerScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groundId: {
      type: DataTypes.INTEGER,
      references: {
        model: TennisGround,
        key: "id",
      },
      allowNull: false,
    },
    surface: {
      type: DataTypes.ENUM("CLAY", "GRASS", "HARD"),
      allowNull: false,
    },
    firstPlayerStatsId: {
      type: DataTypes.INTEGER,
      references: {
        model: PlayerStats,
        key: "id",
      },
      allowNull: true,
    },
    secondPlayerStatsId: {
      type: DataTypes.INTEGER,
      references: {
        model: PlayerStats,
        key: "id",
      },
      allowNull: true,
    },
    tournamentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Tournament,
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "matches",
  }
);

export default Match;
