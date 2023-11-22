import express, { NextFunction } from "express";
import IGame from "../../models/types/game";
import GameData from "../../utils/db/games/GameData";
import MyError from "../../types/Error";
import atBatRouter from "./atbat/index";
import lineupRouter from "./lineup";

const router = express.Router();

router.use("/atBat", atBatRouter);
router.use("/lineup", lineupRouter);

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

// /games/:id?
router.get("/:id?", (req: any, res: any, next: NextFunction) => {
   console.log("/games");
   if (req.params.id) {
      const id = req.params.id as string;
      console.log(id);
      GameData.findById(req.params.id).then((game) => {
         console.log(game);
         res.status(200).send(JSON.stringify(game));
      });
   } else {
      console.log("here");
      GameData.findAllGames().then((games: IGame[]) => {
         res.status(200).send(JSON.stringify(games));
      });
   }
});

const gamesRouter = router;
export default gamesRouter;
