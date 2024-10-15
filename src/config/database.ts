import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

console.log(process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
});

export default sequelize;
