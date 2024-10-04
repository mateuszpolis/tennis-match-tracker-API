import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import TennisGround from "./TennisGround";
import { Surface } from "./enums/Surface";
import TournamentEdition from "./TournamentEdition";

interface TournamentAttributes {
  id: number;
  name: string;
  surface: Surface;
  tennisGroundId: number;
}

export interface TournamentCreationAttributes
  extends Optional<TournamentAttributes, "id"> {}

class Tournament
  extends Model<TournamentAttributes, TournamentCreationAttributes>
  implements TournamentAttributes
{
  declare id: number;
  declare name: string;
  declare surface: Surface;
  declare tennisGroundId: number;
}

Tournament.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surface: {
      type: DataTypes.ENUM(...Object.values(Surface)),
      allowNull: false,
    },
    tennisGroundId: {
      type: DataTypes.INTEGER,
      references: {
        model: TennisGround,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "tournaments",
  }
);

Tournament.belongsTo(TennisGround, {
  foreignKey: "tennisGroundId",
  as: "ground",
});

Tournament.hasMany(TournamentEdition, {
  foreignKey: "tournamentId",
  as: "editions",
});

export type TournamentFilterOptions = {
  name?: string;
  groundId?: number;
  surface?: Surface;
  sortByStartDate?: "asc" | "desc";
  sortByEndDate?: "asc" | "desc";
};

export default Tournament;
