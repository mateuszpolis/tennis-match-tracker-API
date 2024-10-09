import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Tournament from "./Tournament";
import UserTournamentEdition from "./UserTournamentEdition";
import User from "./User";
import Match from "./Match";

interface TournamentEditionAttributes {
  id: number;
  year: number;
  tournamentId: number;
  editionName?: string;
  startDate: Date;
  endDate: Date;
  maximumNumberOfContestants: number;
  currentNumberOfContestants: number;
  registrationOpen: boolean;
  round: number;
  winnerId?: number;
}

export interface TournamentEditionCreationAttributes
  extends Optional<
    TournamentEditionAttributes,
    "editionName" | "currentNumberOfContestants" | "year" | "round"
  > {}

class TournamentEdition
  extends Model<
    TournamentEditionAttributes,
    TournamentEditionCreationAttributes
  >
  implements TournamentEditionAttributes
{
  declare id: number;
  declare year: number;
  declare tournamentId: number;
  declare editionName?: string;
  declare startDate: Date;
  declare endDate: Date;
  declare maximumNumberOfContestants: number;
  declare currentNumberOfContestants: number;
  declare registrationOpen: boolean;
  declare round: number;
  declare winnerId?: number;

  declare readonly players: UserTournamentEdition;
  declare readonly tournament: Tournament;
  declare readonly matches: Match;
  declare readonly winner: User;
}

TournamentEdition.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tournamentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tournament,
        key: "id",
      },
    },
    editionName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    maximumNumberOfContestants: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentNumberOfContestants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    registrationOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    winnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "tournament_editions",
    timestamps: false,
  }
);

export default TournamentEdition;
