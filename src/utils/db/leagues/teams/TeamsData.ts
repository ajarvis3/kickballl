import { v4 as uuidv4 } from "uuid";
import Team from "../../../../models/team";
import ITeam from "../../../../models/types/team";

class TeamData {
   createTeam = (leagueId: string, teamName: string, owner: string) => {
      const _id = uuidv4();
      return new Team({ _id, leagueId, teamName, owner });
   };
   saveTeam = (team: ITeam) => {
      return team.save();
   };
   createAndSaveTeam = (teamName: string, owner: string, leagueId: string) => {
      return this.saveTeam(this.createTeam(leagueId, teamName, owner));
   };
   findById = (_id: string) => {
      return Team.findById(_id).exec();
   };
   findAll = () => {
      return Team.find().exec();
   };
}

export default new TeamData();
