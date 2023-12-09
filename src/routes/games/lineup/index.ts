import express, { NextFunction } from "express";
import ILineup from "../../../models/types/lineup";
import MyError from "../../../types/Error";
import LineupData from "../../../utils/db/lineup/LineupData";
import UserData from "../../../utils/db/users/UserData";
import jwt from "jsonwebtoken";
import LineupAuthChecker from "../../../utils/auth/hierarchy/LineupAuthChecker";
import getToken from "../../../utils/auth/getToken";

const router = express.Router();

const authChecker = new LineupAuthChecker();

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
   authChecker.checkTokenPermissions("lineup", req, res, next);
});

router.post("/", (req, res, next) => {
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;

   UserData.findUserById(decoded.sub).then((user) => {
      if (!user) res.status(401).send();
      authChecker.checkAuthWrite("lineup", "", user!.roles).then((role) => {
         if (role && role._id) {
            res.locals.user = user;
            next();
         } else {
            res.status(403).send();
         }
      });
   });
});

// /games/lineup
router.post("/", (req, res: any, next: NextFunction) => {
   const failed = (res: any) => {
      const err = new MyError(400, "Bad Request");
      res.status(400).send(JSON.stringify(err));
   };
   if (!req.body.teamId) {
      failed(res);
   } else {
      LineupData.createAndSaveLineup(
         req.body.teamId,
         req.body.lineup ? req.body.lineup : [],
         res.locals.user._id
      ).then((lineup: ILineup) => {
         res.status(200).send(JSON.stringify(lineup));
      });
   }
});

// /games/lineup/:lineupId
router.get("/:lineupId", (req, res: any, next: NextFunction) => {
   const failed = () => {
      const err = new MyError(400, "Bad Request");
   };
   if (!req.params.lineupId) {
      failed();
   } else {
      LineupData.findById(req.params.lineupId);
   }
});

const lineupRouter = router;
export default lineupRouter;
