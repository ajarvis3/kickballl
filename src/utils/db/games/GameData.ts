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
      atBatIds: IAtBat[],
      score1: number[],
      score2: number[],
      currOuts: number
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
         score1,
         score2,
         currOuts,
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
      atBatIds: IAtBat[],
      score1: number[],
      score2: number[],
      currOuts: number
   ) => {
      return this.saveGame(
         this.createGame(
            ruleTemplateId,
            currInning,
            isTopInning,
            lineup1Id,
            lineup2Id,
            date,
            atBatIds,
            score1,
            score2,
            currOuts
         )
      );
   };
   updateGame = (id: string, game: IGame) => {
      return Game.findByIdAndUpdate(id, game, { returnDocument: "after" });
   };
   findAllGames = () => {
      return Game.find().exec();
   };
   findById = (id: string) => {
      return Game.findById(id).exec();
   };
}

export default new GameData();
