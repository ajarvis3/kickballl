import express, { NextFunction } from "express";
import IAtBat from "../../../models/types/atbat";
import ITemplate from "../../../models/types/templates";
import MyError from "../../../types/Error";
import AtBatData from "../../../utils/db/atbats/AtBatData";
import TemplateData from "../../../utils/db/templates/TemplateData";

const router = express.Router();

const failed = (res: any) => {
   const err = new MyError(400, "Bad Request");
   res.status(400).send(JSON.stringify(err));
};

const newAtBat = (gameId: string, template: ITemplate) => {
   const countTypes = template.countTypes;
   const initArr = new Array(countTypes.length).fill(0);
   return AtBatData.createAndSaveAtBat(gameId, initArr);
};

router.post("/", (req: any, res: any, next: NextFunction) => {
   if (!req.body.gameId || !req.body.templateId) {
      failed(res);
      return;
   } else {
      TemplateData.getTemplateById(req.body.templateId).then((template) => {
         if (template?._id) {
            newAtBat(req.body.gameId, template).then((atBat: IAtBat) => {
               res.status(200).send(JSON.stringify(atBat));
            });
         } else {
            failed(res);
         }
      });
   }
});

// /games/atBat/:atBatId
router.put("/:atBatId", (req: any, res: any, next: NextFunction) => {
   if (!req.params.atBatId || !req.body.count) {
      failed(res);
      return;
   } else {
      AtBatData.changeAtBatCount(req.params.atBatId, req.body.count).then(
         (atBat: IAtBat) => {
            res.status(200).send(JSON.stringify(atBat));
         }
      );
   }
});

// /games/atBat/:atBatId
router.get("/:atBatId", (req, res: any, next: NextFunction) => {
   if (!req.params.atBatId) {
      failed(res);
      return;
   } else {
      AtBatData.findById(req.params.atBatId);
   }
});

const atBatRouter = router;
export default atBatRouter;
