import TennisGround, {
  TennisGroundCreationAttributes,
} from "../models/TennisGround";
import { Op, Transaction } from "sequelize";

export default class GroundService {
  public getGroundById = async (id: number) => {
    return await TennisGround.findByPk(id, {
      include: ["tournaments"],
    });
  };

  public getGroundsByName = async (name: string) => {
    return await TennisGround.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
  };

  public getAllGrounds = async () => {
    return await TennisGround.findAll();
  };

  public createGround = async (
    ground: TennisGroundCreationAttributes,
    t: Transaction
  ) => {
    return await TennisGround.create(ground, { transaction: t });
  };

  public editGround = async (
    id: number,
    updateData: Partial<TennisGroundCreationAttributes>,
    t: Transaction
  ) => {
    const [updatedRows] = await TennisGround.update(updateData, {
      where: { id },
      transaction: t,
    });

    return updatedRows > 0;
  };

  public deleteGround = async (id: number, t: Transaction) => {
    const deletedRows = await TennisGround.destroy({
      where: { id },
      transaction: t,
    });

    return deletedRows > 0;
  };
}
