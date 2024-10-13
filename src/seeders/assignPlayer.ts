import sequelize from "../config/database";
import User from "../models/User";
import TournamentService from "../services/tournamentService";
import "../models/associations";

const tournamentService = new TournamentService();

const assignPlayersToTournament = async (
  tournamentEditionId: number,
  numberOfPlayers: number
) => {
  try {
    // Fetch all player IDs
    const allPlayers = await User.findAll({ attributes: ["id"] });
    const playerIds = allPlayers.map((player) => player.id);

    if (playerIds.length < numberOfPlayers) {

      return;
    }

    // Shuffle and pick a random subset of player IDs
    const shuffledPlayers = playerIds.sort(() => 0.5 - Math.random());
    const selectedPlayers = shuffledPlayers.slice(0, numberOfPlayers);

    // Fetch tournament edition
    const tournamentEdition = await tournamentService.getTournamentEditionById(
      tournamentEditionId
    );
    if (!tournamentEdition) {
      console.log("Tournament edition does not exist");
      return;
    }

    if (
      tournamentEdition.currentNumberOfContestants + numberOfPlayers >
      tournamentEdition.maximumNumberOfContestants
    ) {
      console.log("Not enough spots in the tournament");
      return;
    }

    const t = await sequelize.transaction();
    try {
      // Sign up each selected player to the tournament
      for (const playerId of selectedPlayers) {
        const existingRecord =
          await tournamentService.getUserTournamentEditionRecord(
            playerId,
            tournamentEdition.id
          );

        if (!existingRecord) {
          await tournamentService.createUserTournamentEdition(
            playerId,
            tournamentEdition.id,
            t
          );
          await tournamentService.increasePlayerNumber(tournamentEdition, t);
        }
      }

      await t.commit();
      console.log(
        `${numberOfPlayers} players signed up successfully to tournament edition ${tournamentEditionId}`
      );
    } catch (err) {
      await t.rollback();
      console.error("Error assigning players to tournament:", err);
    }
  } catch (err) {
    console.error("Error fetching players or tournament:", err);
  }
};

// Call the function
const tournamentEditionId = 19 // Replace with actual tournamentEditionId
const numberOfPlayers = 15; // Replace with the number of players you want to assign
assignPlayersToTournament(tournamentEditionId, numberOfPlayers);
