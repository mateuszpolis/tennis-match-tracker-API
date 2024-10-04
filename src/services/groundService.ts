import TennisGround, {
  TennisGroundCreationAttributes,
} from "../models/TennisGround";
import { Transaction } from "sequelize";

export default class GroundService {
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
