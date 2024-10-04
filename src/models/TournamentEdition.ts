import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Tournament from "./Tournament";

interface TournamentEditionAttributes {
  year: number;
  tournamentId: number;
  editionName?: string;
  startDate: Date;
  endDate: Date;
  maximumNumberOfContestants: number;
  currentNumberOfContestants: number;
}

export interface TournamentEditionCreationAttributes
  extends Optional<
    TournamentEditionAttributes,
    "editionName" | "currentNumberOfContestants"
  > {}

class TournamentEdition
  extends Model<
    TournamentEditionAttributes,
    TournamentEditionCreationAttributes
  >
  implements TournamentEditionAttributes
{
  declare year: number;
  declare tournamentId: number;
  declare editionName?: string;
  declare startDate: Date;
  declare endDate: Date;
  declare maximumNumberOfContestants: number;
  declare currentNumberOfContestants: number;
}

TournamentEdition.init(
  {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    tournamentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
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
  },
  {
    sequelize,
    tableName: "tournament_editions",
    timestamps: false,
  }
);

export default TournamentEdition;
