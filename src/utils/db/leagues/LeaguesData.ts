import League from "../../../models/league";
import { v4 as uuidv4 } from "uuid";
import ILeague from "../../../models/types/league";

class LeagueData {
   createLeague = (leagueName: string, owner: string) => {
      const _id = uuidv4();
      return new League({ _id, leagueName, owner });
   };
   saveLeague = (League: ILeague) => {
      return League.save();
   };
   createAndSaveLeague = (leagueName: string, owner: string) => {
      return this.saveLeague(this.createLeague(leagueName, owner));
   };
   findById = (_id: string) => {
      return League.findById(_id).exec();
   };
   findAll = () => {
      return League.find().exec();
   };
}

export default new LeagueData();
