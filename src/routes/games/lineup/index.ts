import express, { NextFunction } from "express";
import ILineup from "../../../models/types/lineup";
import MyError from "../../../types/Error";
import LineupData from "../../../utils/db/lineup/LineupData";
import IUser from "../../../models/types/user";
import UserData from "../../../utils/db/users/UserData";
import IUserToken from "../../../utils/auth/types/OAuthData";
import IRole from "../../../models/types/role";
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
router.use("/:id?", (req, res, next) => {
   authChecker.checkTokenPermissions(req, res, next);
});

// /games/lineup
router.post("/", (req, res: any, next: NextFunction) => {
   const failed = (res: any) => {
      const err = new MyError(400, "Bad Request");
      res.status(400).send(JSON.stringify(err));
   };
   if (!req.body.teamName) {
      failed(res);
   } else {
      LineupData.createAndSaveLineup(
         req.body.teamName,
         req.body.lineup ? req.body.lineup : []
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
