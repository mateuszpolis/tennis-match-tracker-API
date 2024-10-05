import UserTournamentEdition from "../models/UserTournamentEdition";
import TennisGround from "../models/TennisGround";
import Tournament, {
  TournamentCreationAttributes,
  TournamentFilterOptions,
} from "../models/Tournament";
import TournamentEdition, {
  TournamentEditionCreationAttributes,
} from "../models/TournamentEdition";
import { Op, Transaction, where } from "sequelize";

export default class TournamentService {
  public createTournament = async (
    tournament: TournamentCreationAttributes,
    t: Transaction
  ) => {
    const tennisGround = await TennisGround.findByPk(tournament.tennisGroundId);

    if (!tennisGround) {
      throw new Error("Tennis Ground not found");
    }

    const tournamentData = {
      ...tournament,
      surface: tennisGround.surface,
    };

    return await Tournament.create(tournamentData, { transaction: t });
  };

  public editTournament = async (
    id: number,
    updateData: Partial<TournamentCreationAttributes>,
    t: Transaction
  ) => {
    if (updateData.tennisGroundId) {
      const tennisGround = await TennisGround.findByPk(
        updateData.tennisGroundId
      );

      if (!tennisGround) {
        throw new Error("Tennis Ground not found");
      }

      updateData.surface = tennisGround.surface;
    }

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
    return await Tournament.findByPk(id, {
      include: [
        {
          model: TournamentEdition,
          as: "editions",
          include: [
            {
              model: Tournament,
              as: "tournament",
            },
          ],
        },
        {
          model: TennisGround,
          as: "ground",
        },
      ],
    });
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
      include: ["ground"],
    });
  };

  public createTournamentEdition = async (
    tournamentEdition: TournamentEditionCreationAttributes,
    t: Transaction
  ) => {
    const editionWithYear = {
      ...tournamentEdition,
      year: new Date().getFullYear(),
    };

    return await TournamentEdition.create(editionWithYear, {
      transaction: t,
    });
  };

  public editTournamentEdition = async (
    year: number,
    tournamentId: number,
    updateData: Partial<TournamentEditionCreationAttributes>,
    t: Transaction
  ) => {
    const [updatedRows] = await TournamentEdition.update(updateData, {
      where: { year, tournamentId },
      transaction: t,
    });

    return updatedRows > 0;
  };

  public getFilteredTournamentEditions = async (
    filterOptions: TournamentFilterOptions
  ) => {
    const {
      name,
      groundId,
      surface,
      sortByStartDate,
      sortByEndDate,
      startDateAfter,
    } = filterOptions;

    const whereClause: any = {};

    if (name) {
      whereClause["$Tournament.name$"] = { [Op.like]: `%${name}%` };
    }
    if (groundId) {
      whereClause["$Tournament.groundId$"] = groundId;
    }
    if (surface) {
      whereClause["$Tournament.surface$"] = surface;
    }
    if (startDateAfter) {
      whereClause.startDate = { [Op.gt]: startDateAfter };
    }

    const orderClause: any[] = [];
    if (sortByStartDate) {
      orderClause.push(["startDate", sortByStartDate]);
    }
    if (sortByEndDate) {
      orderClause.push(["endDate", sortByEndDate]);
    }

    return await TournamentEdition.findAll({
      where: whereClause,
      order: orderClause,
      include: ["tournament"],
    });
  };

  public getTournamentEdition = async (id: number, year: number) => {
    return await TournamentEdition.findOne({
      where: {
        year,
        tournamentId: id,
      },
    });
  };

  public getUserTournamentEditionRecord = async (
    userId: number,
    tournamentEditionId: number,
  ) => {
    return await UserTournamentEdition.findOne({
      where: {
        userId,
        tournamentEditionId,
      },
    });
  };

  public createUserTournamentEdition = async (
    userId: number,
    tournamentEditionId: number,
  ) => {
    await UserTournamentEdition.create({
      userId,
      tournamentEditionId,
    });
  };
}
