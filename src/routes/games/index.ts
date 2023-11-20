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
         []
      ).then((game: IGame) => {
         res.status(200).send(JSON.stringify(game));
      });
   }
});

// /games/:id
router.put("/", (req: any, res: any, next: NextFunction) => {
   const failed = () => {
      const err = new MyError(400, "Bad Request");
   };
   if (!req.query.id) {
      failed();
   } else {
      const game: IGame = req.body.game;
      GameData.updateGame(req.query.id, req.body.game);
   }
});

// /game/:id
router.get("/", (req: any, res: any, next: NextFunction) => {
   if (req.query.id) {
      const id = req.query.id as string;
      GameData.findById(id).then((game) => {
         res.status(200).send(JSON.stringify(game));
      });
   }
});

const gamesRouter = router;
export default gamesRouter;
