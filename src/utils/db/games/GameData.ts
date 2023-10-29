import Game from "../../../models/game";
import IGame from "../../../models/types/game";
import { v4 as uuidv4 } from "uuid";
import IAtBat from "../../../models/types/atbat";

class GameData {
   createGame = (
      ruleTemplateId: string,
      currInning: number,
      isTopInning: boolean,
      lineup1Id: string,
      lineup2Id: string,
      date: Date,
      atBatIds: IAtBat[]
   ) => {
      const _id = uuidv4();
      return new Game({
         _id,
         ruleTemplateId,
         currInning,
         isTopInning,
         lineup1Id,
         lineup2Id,
         date,
         atBatIds,
      });
   };
   saveGame = (game: IGame) => {
      return game.save();
   };
   createAndSaveGame = (
      ruleTemplateId: string,
      currInning: number,
      isTopInning: boolean,
      lineup1Id: string,
      lineup2Id: string,
      date: Date,
      atBatIds: IAtBat[]
   ) => {
      return this.saveGame(
         this.createGame(
            ruleTemplateId,
            currInning,
            isTopInning,
            lineup1Id,
            lineup2Id,
            date,
            atBatIds
         )
      );
   };
}

export default new GameData();
