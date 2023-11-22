import express, { NextFunction } from "express";
import MyError from "../../types/Error";
import OutcomeData from "../../utils/db/outcomes/OutcomeData";

const router = express.Router();

// /outcomes
router.post("/", (req: any, res: any, next: NextFunction) => {
   const failed = () => {
      const err = new MyError(400, "Bad Request");
   };
   if (!req.body.name || !req.body.conditionFields || req.body.countTypes) {
      failed();
   } else {
      OutcomeData.createAndSaveOutcome(
         req.body.name,
         req.body.conditionFields,
         req.body.countTypes
      );
      res.status(200).send();
   }
});

const outcomesRouter = router;
export default outcomesRouter;
