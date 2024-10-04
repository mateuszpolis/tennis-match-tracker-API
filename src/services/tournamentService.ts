import Tournament, {
  TournamentCreationAttributes,
  TournamentFilterOptions,
} from "models/Tournament";
import { Op, Transaction } from "sequelize";

export default class TournamentService {
  public createTournament = async (
    tournament: TournamentCreationAttributes,
    t: Transaction
  ) => {
    return await Tournament.create(tournament, { transaction: t });
  };

  public editTournament = async (
    id: number,
    updateData: Partial<TournamentCreationAttributes>,
    t: Transaction
  ) => {
    const [updatedRows] = await Tournament.update(updateData, {
      where: { id },
      transaction: t,
    });

    return updatedRows > 0;
  };

  public getTournaments = async (query?: string) => {
    const whereClause = query ? { name: { [Op.like]: `%${query}%` } } : {};

    return await Tournament.findAll({ where: whereClause });
  };

  public getTournamentById = async (id: number) => {
    return await Tournament.findByPk(id);
  };

  public getFilteredTournaments = async (
    filterOptions: TournamentFilterOptions
  ) => {
    const { name, groundId, surface, sortByStartDate, sortByEndDate } =
      filterOptions;

    const whereClause: any = {};

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }
    if (groundId) {
      whereClause.groundId = groundId;
    }
    if (surface) {
      whereClause.surface = surface;
    }

    const orderClause: any[] = [];
    if (sortByStartDate) {
      orderClause.push(["startDate", sortByStartDate]);
    }
    if (sortByEndDate) {
      orderClause.push(["endDate", sortByEndDate]);
    }

    return await Tournament.findAll({
      where: whereClause,
      order: orderClause,
    });
  };
}
