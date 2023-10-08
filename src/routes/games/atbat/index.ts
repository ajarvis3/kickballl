import { NextFunction } from "express";
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
            res.status(200).send(atBat);
         }
      );
   }
});
