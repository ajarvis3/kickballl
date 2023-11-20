import express, { NextFunction } from "express";
import IAtBat from "../../../models/types/atbat";
import MyError from "../../../types/Error";
import AtBatData from "../../../utils/db/atbats/AtBatData";

const router = express.Router();

router.put("/:atBatId", (req: any, res: any, next: NextFunction) => {
   const failed = () => {
      const err = new MyError(400, "Bad Request");
   };
   if (!req.params.atBatId || !req.body.count) {
      failed();
   } else {
      AtBatData.changeAtBatCount(req.params.atBatId, req.body.count).then(
         (atBat: IAtBat) => {
            res.status(200).send(JSON.stringify(atBat));
         }
      );
   }
});

router.get("/:atBatId", (req, res: any, next: NextFunction) => {
   const failed = () => {
      const err = new MyError(400, "Bad Request");
   };
   if (!req.params.atBatId) {
      failed();
   } else {
      AtBatData.findById(req.params.atBatId);
   }
});

const atBatRouter = router;
export default atBatRouter;
