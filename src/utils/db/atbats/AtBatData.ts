import AtBat from "../../../models/atbat";
import { v4 as uuidv4 } from "uuid";
import IAtBat from "../../../models/types/atbat";
import IOutcome from "../../../models/types/outcome";

const returnUpdatedAtBat = (updatedAtBat: IAtBat) => {
   return updatedAtBat;
};

class AtBatData {
   createAtBat = (gameId: string, count: number[]) => {
      const _id = uuidv4();
      const timeUpdated = Date.now();
      const outcome = null;
      return new AtBat({ _id, gameId, count, outcome, timeUpdated });
   };
   saveAtBat = (atBat: IAtBat) => {
      return atBat.save();
   };
   createAndSaveAtBat = (gameId: string, count: number[]) => {
      return this.saveAtBat(this.createAtBat(gameId, count));
   };
   changeAtBatCount = (_id: string, count: number[]) => {
      return AtBat.findOneAndUpdate({ _id }, { count: count }).then(
         (updatedAtBat: any) => {
            return updatedAtBat as IAtBat;
         }
      );
   };
   changeAtBatOutcome = (_id: string, outcome: IOutcome) => {
      return AtBat.findOneAndUpdate({ _id }, { outcome: outcome }).then(
         (updatedAtBat: any) => {
            return updatedAtBat as IAtBat;
         }
      );
   };
   findById = (_id: string) => {
      return AtBat.findOne({ _id }).exec();
   };
}

export default new AtBatData();
