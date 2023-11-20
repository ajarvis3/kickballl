import ITemplate from "../../models/types/templates";
import TemplateData from "../../utils/db/templates/TemplateData";
import MyError from "../../types/Error";
import express, { NextFunction } from "express";

const router = express.Router();

// /templates
router.post("/", (req: any, res: any, next: NextFunction) => {
   const failed = () => {
      const err = new MyError(400, "Bad Request");
   };
   if (
      !req.body.countTypes ||
      !req.body.inningSlaughterRule ||
      !req.body.inningSlaughterRuleEffectiveLastLicks ||
      !req.body.gameSlaughterRule ||
      !req.body.gameSlaughterEffectiveInning ||
      !req.body.outcomes ||
      !req.body.maxInnings
   ) {
      failed();
   } else {
      TemplateData.createAndSaveTemplate(
         req.body.countTypes,
         req.body.inningSlaughterRule,
         req.body.inningSlaughterRuleEffectiveLastLicks,
         req.body.gameSlaughterRule,
         req.body.gameSlaughterEffectiveInning,
         req.body.outcomes,
         req.body.maxInnings
      ).then((template: ITemplate) => {
         res.status(200).send(JSON.stringify(template));
      });
   }
});

// /templates/:id?
router.get("/", (req: any, res: any, next: NextFunction) => {
   if (req.query.id) {
      res.status(200).send(
         JSON.stringify(TemplateData.getTemplateById(req.query.id))
      );
   } else {
      TemplateData.getAllTemplates().then((templates: ITemplate[]) => {
         res.status(200).send(JSON.stringify(templates));
      });
   }
});

const templatesRouter = router;
export default templatesRouter;
