import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  surname: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  rankingPoints: number;
  confirmationToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
}

export interface UserPublic
  extends Omit<UserAttributes, "password" | "confirmationToken"> {}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "rankingPoints"> {}

export enum UserRole {
  Admin = "Admin",
  Moderator = "Moderator",
  User = "User",
}

export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare surname: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;
  declare status: UserStatus;
  declare rankingPoints: number;
  declare confirmationToken: string | null;
  declare resetPasswordToken: string | null;
  declare resetPasswordExpires: Date | null;
}

User.init(
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
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "Moderator", "User"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
    },
    rankingPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    confirmationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
