import express, { NextFunction } from "express";
import IGame from "../../models/types/game";
import GameData from "../../utils/db/games/GameData";
import MyError from "../../types/Error";
import atBatRouter from "./atbat/index";
import lineupRouter from "./lineup";
import TemplateData from "../../utils/db/templates/TemplateData";
import ITemplate from "../../models/types/templates";
import AtBatData from "../../utils/db/atbats/AtBatData";
import IOutcome from "../../models/types/outcome";
import IAtBat from "../../models/types/atbat";
import LineupData from "../../utils/db/lineup/LineupData";
import IGameResponse from "../../models/types/gameResponse";

const router = express.Router();

router.use("/atBat", atBatRouter);
router.use("/lineup", lineupRouter);

const failed = (res: any) => {
   const err = new MyError(400, "Bad Request");
   res.status(400).send(JSON.stringify(err));
};

const newAtBat = (gameId: string, template: ITemplate) => {
   const countTypes = template.countTypes;
   const initArr = new Array(countTypes.length).fill(0);
   return AtBatData.createAndSaveAtBat(gameId, initArr);
};

const updateGame = (gameId: string, game: IGame, res: any) => {
   GameData.updateGame(gameId, game).then((newGame) => {
      if (newGame?._id) {
         res.status(200).send(JSON.stringify(newGame));
      } else {
         failed(res);
         return;
      }
   });
   return;
};

// /games
router.post("/", (req: any, res: any, next: NextFunction) => {
   console.log("POST /games", req.body);
   if (!req.body.ruleTemplateId || !req.body.lineup1Id || !req.body.lineup2Id) {
      failed(res);
      return;
   } else {
      TemplateData.getTemplateById(req.body.ruleTemplateId).then((template) => {
         if (template?._id) {
            const maxInnings = template.maxInnings;
            const initialScores = new Array(maxInnings).fill(0);
            GameData.createAndSaveGame(
               req.body.ruleTemplateId,
               1,
               true,
               req.body.lineup1Id,
               req.body.lineup2Id,
               new Date(),
               [],
               initialScores,
               initialScores,
               0
            ).then((game: IGame) => {
               newAtBat(game._id, template).then((value: IAtBat) => {
                  game.atBatIds.push(value);
                  updateGame(game._id, game, res);
               });
            });
         }
      });
   }
});

// /games/:id
router.put("/:id", (req: any, res: any, next: NextFunction) => {
   // console.log("PUT /games/:id", req.body.body);
   if (!req.params.id) {
      failed(res);
      return;
   } else {
      const game: IGame = req.body.body.game;
      console.log("Curr Outs1:" + game.currOuts);
      TemplateData.getTemplateById(game.ruleTemplateId).then((template) => {
         if (template?._id) {
            const atBats = game.atBatIds;
            const currAtBat = atBats[atBats.length - 1];
            let atBatOutcome: IOutcome | undefined = currAtBat.outcome
               ? currAtBat.outcome
               : undefined;
            template.outcomes.forEach((outcome) => {
               console.log(currAtBat, outcome);
               if (
                  atBatOutcome === undefined &&
                  outcome.testOutcome(currAtBat)
               ) {
                  atBatOutcome = outcome;
                  currAtBat.outcome = atBatOutcome;
                  if (outcome.name.toUpperCase().indexOf("OUT") != -1) {
                     game.currOuts += 1;
                  }
                  game.atBatIds[game.atBatIds.length - 1] = currAtBat;
               }
            });
            if (game.currOuts === 3) {
               game.currOuts = 0;
               if (game.isTopInning) {
                  game.isTopInning = false;
               } else {
                  game.isTopInning = true;
                  game.currInning += 1;
               }
            }
            console.log("Curr Outs2:" + game.currOuts);
            if (atBatOutcome === undefined && currAtBat !== undefined) {
               updateGame(req.params.id, game, res);
            } else {
               newAtBat(game._id, template).then((value: IAtBat) => {
                  game.atBatIds.push(value);
                  updateGame(req.params.id, game, res);
               });
            }
         } else failed(res);
      });
   }
});

// /games/:id?
router.get("/:id?", (req: any, res: any, next: NextFunction) => {
   console.log("GET /games:id");
   if (req.params.id) {
      const id = req.params.id as string;
      GameData.findById(req.params.id).then((game) => {
         if (game?._id) {
            LineupData.findById(game.lineup1Id!).then((lineup1) => {
               LineupData.findById(game.lineup2Id!).then((lineup2) => {
                  if (
                     (lineup1 === undefined || lineup1?._id) &&
                     (lineup2 === undefined || lineup2?._id)
                  ) {
                     const gameResp: IGameResponse = {
                        ...game.toObject(),
                        lineup1: undefined,
                        lineup2: undefined,
                     };
                     gameResp.lineup1 = lineup1;
                     gameResp.lineup2 = lineup2;
                     res.status(200).send(JSON.stringify(gameResp));
                  }
               });
            });
         } else {
            failed(res);
         }
      });
   } else {
      GameData.findAllGames().then(async (games: IGame[]) => {
         const gameRespArr: IGameResponse[] = [];

         for (let i = 0; i < games.length; i++) {
            const game = games[i];
            await LineupData.findById(game.lineup1Id!).then(async (lineup1) => {
               await LineupData.findById(game.lineup2Id!).then((lineup2) => {
                  if (
                     (lineup1 === undefined || lineup1?._id) &&
                     (lineup2 === undefined || lineup2?._id)
                  ) {
                     const gameResp: IGameResponse = {
                        ...game.toObject(),
                        lineup1: undefined,
                        lineup2: undefined,
                     };
                     gameResp.lineup1 = lineup1;
                     gameResp.lineup2 = lineup2;
                     gameRespArr.push(gameResp);
                     console.log(1);
                  }
               });
            });
         }
         res.status(200).send(JSON.stringify(gameRespArr));
         console.log("returned");
      });
   }
});

const gamesRouter = router;
export default gamesRouter;
