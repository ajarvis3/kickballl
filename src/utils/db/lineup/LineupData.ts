import Lineup from "../../../models/lineup";
import { v4 as uuidv4 } from "uuid";
import ILineup from "../../../models/types/lineup";
import IOutcome from "../../../models/types/outcome";

const returnUpdatedLineup = (updatedLineup: ILineup) => {
   return updatedLineup;
};

class LineupData {
   createLineup = (teamName: string, lineup: string[], owner: string) => {
      const _id = uuidv4();
      return new Lineup({ _id, teamName, lineup, owner });
   };
   saveLineup = (Lineup: ILineup) => {
      return Lineup.save();
   };
   createAndSaveLineup = (
      teamName: string,
      lineup: string[],
      owner: string
   ) => {
      return this.saveLineup(this.createLineup(teamName, lineup, owner));
   };
   findById = (_id: string) => {
      return Lineup.findById(_id).exec();
   };
}

export default new LineupData();
