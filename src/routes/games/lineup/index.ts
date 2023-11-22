import express, { NextFunction } from "express";
import ILineup from "../../../models/types/lineup";
import MyError from "../../../types/Error";
import LineupData from "../../../utils/db/lineup/LineupData";

const router = express.Router();

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
