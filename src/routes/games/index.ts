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
import IUser from "../../models/types/user";
import UserData from "../../utils/db/users/UserData";
import IUserToken from "../../utils/auth/types/OAuthData";
import IRole from "../../models/types/role";
import jwt from "jsonwebtoken";
import GameAuthChecker from "../../utils/auth/hierarchy/GameAuthChecker";
import getToken from "../../utils/auth/getToken";

const router = express.Router();

const authChecker = new GameAuthChecker();

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

const returnIndividualGame = (id: string, res: any) => {
   GameData.findById(id).then((game) => {
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
};

const updateGame = (gameId: string, game: IGame, res: any) => {
   GameData.updateGame(gameId, game).then((newGame) => {
      if (newGame?._id) {
         returnIndividualGame(gameId, res);
         // res.status(200).send(JSON.stringify(newGame));
      } else {
         failed(res);
         return;
      }
   });
   return;
};

// check for header
router.use("/", (req, res, next) => {
   authChecker.checkTokenExists(req, res, next);
});

// check token valid
router.use("/", (req, res, next) => {
   authChecker.checkTokenValid(req, res, next);
});

// check for permissions
router.use("/:id", (req, res, next) => {
   authChecker.checkTokenPermissions("game", req, res, next);
});

router.post("/", (req, res, next) => {
   if (!req.body.ruleTemplateId || !req.body.lineup1Id || !req.body.lineup2Id) {
      failed(res);
      return;
   }
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;

   UserData.findUserById(decoded.sub).then((user) => {
      if (!user) res.status(401).send();
      authChecker
         .checkAuthWrite("template", req.body.ruleTemplateId, user!.roles)
         .then((role) => {
            if (role && role._id) {
               next();
            } else {
               res.status(403).send();
            }
         });
   });
});

// /games
router.post("/", (req: any, res: any, next: NextFunction) => {
   // TODO: need to check write permissions
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
      const decoded: any = jwt.decode(
         getToken(req.headers.authentication as string) as string
      ) as any;

      UserData.findUserById(decoded.sub).then((user) => {
         if (!user) res.status(401).send();
         authChecker
            .checkAuthWrite("game", req.params.id, user!.roles)
            .then((role) => {
               if (role && role._id) {
                  next();
               } else {
                  GameData.findById(req.params.id).then((game) => {
                     res.status(403).send(JSON.stringify(game));
                  });
               }
            });
      });
   }
});

// after auth
router.put("/:id", (req, res, next) => {
   const game: IGame = req.body.body.game;
   TemplateData.getTemplateById(game.ruleTemplateId).then((template) => {
      if (template?._id) {
         const atBats = game.atBatIds;
         const currAtBat = atBats[atBats.length - 1];
         let atBatOutcome: IOutcome | undefined = currAtBat.outcome
            ? currAtBat.outcome
            : undefined;
         template.outcomes.forEach((outcome) => {
            if (atBatOutcome === undefined && outcome.testOutcome(currAtBat)) {
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
   } else if (!req.query.templateId) {
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
                  }
               });
            });
         }
         res.status(200).send(JSON.stringify(gameRespArr));
      });
   } else {
      const templateId = req.query.templateId;
      GameData.getTemplatesByTemplateId(templateId).then(
         async (games: IGame[]) => {
            const gameRespArr: IGameResponse[] = [];

            for (let i = 0; i < games.length; i++) {
               const game = games[i];
               await LineupData.findById(game.lineup1Id!).then(
                  async (lineup1) => {
                     await LineupData.findById(game.lineup2Id!).then(
                        (lineup2) => {
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
                           }
                        }
                     );
                  }
               );
            }
            res.status(200).send(JSON.stringify(gameRespArr));
         }
      );
   }
});

const gamesRouter = router;
export default gamesRouter;
