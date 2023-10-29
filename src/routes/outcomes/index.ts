import express, { NextFunction } from "express";
import MyError from "../../types/Error";
import OutcomeData from "../../utils/db/outcomes/OutcomeData";

const router = express.Router;

router.post("/", (req: any, res: any, next: NextFunction) => {
   const failed = () => {
      const err = new MyError(400, "Bad Request");
   };
   if (!req.body.name || !req.body.conditionFields) {
      failed();
   } else {
      OutcomeData.createAndSaveOutcome(req.body.name, req.body.conditionFields);
   }
});

const outcomesRouter = router;
export default outcomesRouter;