import { NextFunction } from "express";
import IGame from "src/models/types/game";
import GameData from "src/utils/db/games/GameData";
import MyError from "../../types/Error";

const router = express.Router();

router.post("/", (req: any, res: any, next: NextFunction) => {
   const failed = () => {
      const err = new MyError(400, "Bad Request");
   };
   if (!req.body.ruleTemplateId || !req.body.lineup1Id || !req.body.lineup2Id) {
      failed();
   } else {
      GameData.createAndSaveGame(
         req.body.ruleTemplateId,
         1,
         true,
         req.body.lineup1Id,
         req.body.lineup2Id,
         new Date(),
         []
      ).then((game: IGame) => {
         res.status(200).send(game);
      });
   }
});