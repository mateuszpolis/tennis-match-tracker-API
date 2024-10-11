import { Op } from "sequelize";
import User from "../models/User";

export default class UserService {
  public getUsersByQuery = async (query: string = "") => {
    if (!query) {
      return await User.findAll();
    }

    return await User.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            surname: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
    });
  };

  public getUserById = async (id: number) => {
    return await User.findByPk(id);
  };

  public getRanking = async () => {
    return await User.findAll({
      attributes: ["id", "name", "surname", "rankingPoints"],
      order: [["rankingPoints", "DESC"]],
    });
  };
}
