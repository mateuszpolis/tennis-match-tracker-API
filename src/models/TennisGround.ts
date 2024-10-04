import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Surface } from "./enums/Surface";
import Tournament from "./Tournament";

interface TennisGroundAttributes {
  id: number;
  name: string;
  description: string;
  constructionDate: Date;
  country: string;
  city: string;
  surface: Surface;
}

interface TennisGroundCreationAttributes
  extends Optional<TennisGroundAttributes, "id"> {}

class TennisGround
  extends Model<TennisGroundAttributes, TennisGroundCreationAttributes>
  implements TennisGroundAttributes
{
  declare id: number;
  declare name: string;
  declare description: string;
  declare constructionDate: Date;
  declare country: string;
  declare city: string;
  declare surface: Surface;
}

TennisGround.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    constructionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surface: {
      type: DataTypes.ENUM(...Object.values(Surface)),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "tennis_grounds",
  }
);

TennisGround.hasMany(Tournament, {
  foreignKey: "tennisGroundId",
  as: "tournaments",
});

export default TennisGround;
