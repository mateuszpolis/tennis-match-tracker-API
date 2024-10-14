export default class MatchService {
  public createMatchesForTournament = jest.fn();
  public getMatchById = jest.fn();
  public createMatch = jest.fn();
  public updateMatch = jest.fn();
  public setFinishedStatus = jest.fn();
  public getLastMatchesBetweenPlayers = jest.fn();
  public createOrUpdatePlayerStats = jest.fn();
  public getUpcomingMatchesForUser = jest.fn();
  public queryMatches = jest.fn();
}
