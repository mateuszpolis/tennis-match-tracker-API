import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
import TournamentEdition from "./TournamentEdition";

interface UserTournamentEditionAttributes {
  userId: number;
  tournamentEditionId: number;
  numberOfMatches: number;
  numberOfWins: number;
  numberOfLosses: number;
  round: number;
  pointsReceived: number;
}

export interface UserTournamentEditionCreationAttributes
  extends Optional<
    UserTournamentEditionAttributes,
    | "numberOfMatches"
    | "numberOfWins"
    | "numberOfLosses"
    | "round"
    | "pointsReceived"
  > {}

class UserTournamentEdition
  extends Model<
    UserTournamentEditionAttributes,
    UserTournamentEditionCreationAttributes
  >
  implements UserTournamentEditionAttributes
{
  declare userId: number;
  declare tournamentEditionId: number;
  declare numberOfMatches: number;
  declare numberOfWins: number;
  declare numberOfLosses: number;
  declare round: number;
  declare pointsReceived: number;
}

UserTournamentEdition.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    tournamentEditionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: TournamentEdition,
        key: "id",
      },
      allowNull: false,
    },
    numberOfMatches: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    numberOfWins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    numberOfLosses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    round: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    pointsReceived: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "user_tournament_editions",
    timestamps: false,
  }
);

export default UserTournamentEdition;
