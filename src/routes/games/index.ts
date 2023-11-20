import express, { NextFunction } from "express";
import IGame from "../../models/types/game";
import GameData from "../../utils/db/games/GameData";
import MyError from "../../types/Error";
import atBatRouter from "./atbat/index";

const router = express.Router();

router.use("/atBat", atBatRouter);

// /games
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
         [],
         [],
         [],
         0
      ).then((game: IGame) => {
         res.status(200).send(JSON.stringify(game));
      });
   }
});

// /games/:id
router.put("/:id", (req: any, res: any, next: NextFunction) => {
   const failed = () => {
      const err = new MyError(400, "Bad Request");
   };
   if (!req.params.id) {
      failed();
   } else {
      const game: IGame = req.body.game;
      GameData.updateGame(req.params.id, req.body.game);
   }
});

// /game/:id?
router.get("/:id?", (req: any, res: any, next: NextFunction) => {
   if (req.params.id) {
      const id = req.params.id as string;
      GameData.findById(id).then((game) => {
         res.status(200).send(JSON.stringify(game));
      });
   } else {
      GameData.findAllGames().then((games) => {
         res.status(200).send(JSON.stringify(games));
      });
   }
});

const gamesRouter = router;
export default gamesRouter;
